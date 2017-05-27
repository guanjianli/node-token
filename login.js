/**
 * Created by liguanjian on 2017-5-18.
 */

var ds = require("./login_server.js");
var token = require("./token.js");
var _ = require("underscore");
var upload = require("./imageupload");

function loginInit(app) {
    app.get('/ser/login', function (req, res) {
        if (!req.query.name || !req.query.password) {
            res.send(JSON.stringify({code: -2, detail: '没有输入帐号或密码'}));
            return;
        }
        ds.queryUser(req.query.name, function (results) {
            //no find
            if (results.length < 1) {
                res.send(JSON.stringify({code: -4, detail: '用户不存在'}));
            } else {
                var u = results[0];
                if (req.query.password != u.password) {
                    res.send(JSON.stringify({code: -3, detail: '密码错误'}));
                    //todo 限制下次登录时间，不可以连续暴力刷新
                } else {
                    token.setTokenToMap({name:req.query.name}, function (data) {
                        res.send(JSON.stringify(_.extend({code: 0}, {avatar:u.avatar} , data)));
                    })
                }
            }
        }, function (err) {
            res.send(JSON.stringify({code: -1, err: err}));
        })
    });

    app.get('/ser/register', function (req, res) {
        if (!req.query.name || !req.query.password) {
            res.send(JSON.stringify({code: -2, detail: '注册需要帐号和密码'}));
            return;
        }

        ds.queryUser(req.query.name, function (results) {
            if (results.length >= 1) {
                res.send(JSON.stringify({code: -5, detail: '用户已被注册'}));
            } else {
                ds.insertUser(req.query.name, req.query.password, function () {
                    res.send(JSON.stringify({code: 0, detail: '注册成功!'}));
                }, function (err) {
                    res.send(JSON.stringify({code: -3, err: err}));
                })
            }
        }, function (err) {
            res.send(JSON.stringify({code: -1, err: err}));
        })

    });

    app.get('/ser/change', function (req, res) {
        if (!req.query.password || !req.query.name || !req.query.oldpassword) {
            res.send(JSON.stringify({code: -2, detail: '参数缺失'}));
            return;
        }
        ds.queryUser(req.query.name, function (results) {
            if (results.length < 1) {
                res.send(JSON.stringify({code: -4, detail: '用户不存在'}));
            } else {
                var u = results[0];
                if (req.query.oldpassword != u.password) {
                    res.send(JSON.stringify({code: -3, detail: '旧密码错误'}));
                    //todo 限制下次登录时间，不可以连续暴力刷新
                } else {
                    ds.changePasswd(req.query.name, req.query.password, function (results) {
                        if (results.affectedRows >= 1) {
                            //修改密码成功后，以往所有的token会过期
                            token.deleteAll(req.query.name);
                            res.send(JSON.stringify({code: 0, detail: '修改密码成功'}));
                        } else {
                            res.send(JSON.stringify({code: -3, detail: '修改失败，检查用户名与密码'}));
                        }
                    }, function (err) {
                        res.send(JSON.stringify({code: -1, err: err}));
                    })
                }
            }
        }, function (err) {
            res.send(JSON.stringify({code: -1, err: err}));
        })
    });

    app.get('/ser/refresh', function (req, res) {
        token.refreshToken(req,res);
    });

    app.get('/ser/heartbeat', function (req, res) {
        token.verifyToken(req, res, function (useName) {
            res.send(JSON.stringify({code: 0, data: 1}));
        })
    });

    //上传头像
    app.post('/avatar', function (req, res) {
        token.verifyToken(req, res, function (useName) {
            upload.upload(req,res,function (url) {
                ds.setAvatar(url, useName, function () {
                    res.send(JSON.stringify({code: 0, avatar: url}));
                }, function (err) {
                    res.send(JSON.stringify({code: -1, detail: err}));
                })
            });
        })
    });
}

exports.loginInit = loginInit;