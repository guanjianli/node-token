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
    ds.queryUser(req.query.name, function (error, results) {
        if (error) {res.json({code: -1, err: error}); return;}
        //no find
        if (results.length < 1) {
            res.json({code: -4, detail: '用户不存在'});
        } else {
            var u = results[0];
            if (req.query.password != u.password) {
                res.json({code: -3, detail: '密码错误'});
                //todo 限制下次登录时间，不可以连续暴力刷新
            } else {
                token.setTokenToMap({name: req.query.name, uid:u.id}, function (data) {
                    res.json(_.extend({code: 0}, {uid: u.id, avatar: u.avatar, viplv: u.vip}, data));
                })
            }
        }
    })
});

router.get('/ser/register', function (req, res) {
    if (!req.query.name || !req.query.password) {
        res.json({code: -2, detail: '注册需要帐号和密码'});
        return;
    }

    ds.queryUser(req.query.name, function (error, results) {
        if (error) {res.json({code: -1, err: error}); return;}
        if (results.length >= 1) {
            res.json({code: -5, detail: '用户已被注册'});
        } else {
            ds.insertUser(req.query.name, req.query.password, function (error) {
                if (error) {res.json({code: -1, err: error}); return;}
                res.json({code: 0, detail: '注册成功'});
            })
        }
    })

});

router.get('/ser/change', function (req, res) {
    if (!req.query.password || !req.query.name || !req.query.oldpassword) {
        res.json({code: -2, detail: '参数缺失'});
        return;
    }
    ds.queryUser(req.query.name, function (error, results) {
        if (error) {res.json({code: -1, err: error}); return;}
        if (results.length < 1) {
            res.json({code: -4, detail: '用户不存在'});
        } else {
            var u = results[0];
            if (req.query.oldpassword != u.password) {
                res.json({code: -3, detail: '旧密码错误'});
                //todo 限制下次登录时间，不可以连续暴力刷新
            } else {
                ds.changePasswd(req.query.name, req.query.password, function (error, results) {
                    if (error) {res.json({code: -1, err: error}); return;}
                    if (results.affectedRows >= 1) {
                        //修改密码成功后，以往所有的token会过期
                        token.deleteAll(req.query.name);
                        res.json({code: 0, detail: '修改密码成功'});
                    } else {
                        res.json({code: -6, detail: '修改失败，检查用户名与密码'});
                    }
                })
            }
        }
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
            ds.setAvatar(url, useName, function (error) {
                if (error) {res.json({code: -1, err: error}); return;}
                res.json({code: 0, avatar: url});
            })
        });
    })
});

//上传任意文件
router.post('/appupdate', function (req, res) {
    upload.anyFileUpload(req, res, function (url) {
        res.json({code: 0, url: url});
    });
});

//以token获得用户自己的资料
router.get('/user/myinfo', function (req, res) {
    token.verifyToken(req, res, function (useName) {
        ds.queryUser(useName, function (error, result) {
            if (error) {res.json({code: -1, err: error}); return;}
            let u = result[0];
            res.json(_.extend({code: 0}, {avatar: u.avatar, registertime: u.registertime, viplv: u.vip}));
        })
    })
});

//通过id，获得他人的信息
router.get('/user/info', function (req, res) {
    let uid = req.query.uid;
    if (!uid) {
        res.json({code: -2, detail: '参数缺失 name miss'});
        return;
    }
    ds.queryUserByID(uid, function (error, result) {

        let u = result[0];
        if(u){
            res.json(_.extend({code: 0}, _.pick(u, ['name', 'avatar', 'vip'])));
        }else {
            res.json({code: -4, detail: '用户不存在'});
        }
    })
});

module.exports = router;