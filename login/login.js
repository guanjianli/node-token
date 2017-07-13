/**
 * Created by liguanjian on 2017-5-18.
 */

var ds = require("./login_server.js");
var token = require("./token.js");
var _ = require("underscore");
var upload = require("../util/imageupload");
var router = require("express").Router();


router.get('/ser/login', function (req, res) {
    if (!req.query.name || !req.query.password) {
        res.json({code: -2, detail: '没有输入帐号或密码'});
        return;
    }
    ds.queryUser(req.query.name, function (results) {
        //no find
        if (results.length < 1) {
            res.json({code: -4, detail: '用户不存在'});
        } else {
            var u = results[0];
            if (req.query.password != u.password) {
                res.json({code: -3, detail: '密码错误'});
                //todo 限制下次登录时间，不可以连续暴力刷新
            } else {
                token.setTokenToMap({name: req.query.name}, function (data) {
                    res.json(_.extend({code: 0}, {avatar: u.avatar, viplv: u.vip}, data));
                })
            }
        }
    }, function (err) {
        res.json({code: -1, err: err});
    })
});

router.get('/ser/register', function (req, res) {
    if (!req.query.name || !req.query.password) {
        res.json({code: -2, detail: '注册需要帐号和密码'});
        return;
    }

    ds.queryUser(req.query.name, function (results) {
        if (results.length >= 1) {
            res.json({code: -5, detail: '用户已被注册'});
        } else {
            ds.insertUser(req.query.name, req.query.password, function () {
                res.json({code: 0, detail: '注册成功'});
            }, function (err) {
                res.json({code: -1, err: err});
            })
        }
    }, function (err) {
        res.json({code: -1, err: err});
    })

});

router.get('/ser/change', function (req, res) {
    if (!req.query.password || !req.query.name || !req.query.oldpassword) {
        res.json({code: -2, detail: '参数缺失'});
        return;
    }
    ds.queryUser(req.query.name, function (results) {
        if (results.length < 1) {
            res.json({code: -4, detail: '用户不存在'});
        } else {
            var u = results[0];
            if (req.query.oldpassword != u.password) {
                res.json({code: -3, detail: '旧密码错误'});
                //todo 限制下次登录时间，不可以连续暴力刷新
            } else {
                ds.changePasswd(req.query.name, req.query.password, function (results) {
                    if (results.affectedRows >= 1) {
                        //修改密码成功后，以往所有的token会过期
                        token.deleteAll(req.query.name);
                        res.json({code: 0, detail: '修改密码成功'});
                    } else {
                        res.json({code: -6, detail: '修改失败，检查用户名与密码'});
                    }
                }, function (err) {
                    res.json({code: -1, err: err});
                })
            }
        }
    }, function (err) {
        res.json({code: -1, err: err});
    })
});

router.get('/ser/refresh', function (req, res) {
    token.refreshToken(req, res);
});

router.get('/ser/logout', function (req, res) {
    token.verifyToken(req, res, function (useName) {
        token.logoutAToken(req.header.token, res, function () {
            res.json({code: 0, detail: '登出成功'});
        });
    });
});

router.get('/ser/heartbeat', function (req, res) {
    token.verifyToken(req, res, function (useName) {
        res.json({code: 0, data: 1});
    })
});

//上传头像
router.post('/avatar', function (req, res) {
    token.verifyToken(req, res, function (useName) {
        upload.upload(req, res, function (url) {
            ds.setAvatar(url, useName, function () {
                res.json({code: 0, avatar: url});
            }, function (err) {
                res.json({code: -1, err: err});
            })
        });
    })
});

//以token获得用户自己的资料
router.get('/ser/myinfo', function (req, res) {
    token.verifyToken(req, res, function (useName) {
        ds.queryUser(useName, function (result) {
            var u = result[0];
            res.json(_.extend({code: 0}, {avatar: u.avatar, registertime: u.registertime, viplv: u.vip}));
        })
    })
});


exports = router;