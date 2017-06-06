/**
 * Created by liguanjian on 2017-5-18.
 */
var fs = require("fs");
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var _ = require("underscore");
var async = require("async");
var ds = require("./token_server.js");

// sign with RSA SHA256
var priCert = fs.readFileSync('./liguanjian.key');  // get private key
var pubCert = fs.readFileSync('./liguanjian.pem');  // get public key

//对称加密使用HS256,非对称加密使用RS256
//如果使用HS256，使用相同的private key加密，解密
exports.sign = function (obj, expiresIn, cb) {
    jwt.sign(obj, priCert, {algorithm: 'HS256', expiresIn: expiresIn}, function (err, token) {
        cb(token);
    });
};

exports.verify = function (token, errCb, done) {
    jwt.verify(token, priCert, {algorithms: ['HS256']}, function (err, decoded) {
        if (err && (err.name == 'TokenExpiredError')) {
            errCb("expired");
        } else if (err && (err.name == 'JsonWebTokenError')) {
            errCb("tokenError");
        } else if (!err) {
            done(decoded);
        } else {
            errCb(err);
        }
    });
};

//---------

//所有的token来此验证 express
exports.verifyToken = function (req, res, cb) {
    if (!req.query.token) {
        res.send(JSON.stringify({code: -2, detail: 'token缺失'}));
        return;
    }
    exports.verify(req.query.token, function (tips) {
        if (tips === 'expired') {
            //如果token过期，再验证refresh是否过期
            getRefreshTokenByToken(req.query.token, req, res, function (refreshToken) {
                exports.verify(refreshToken, function (tips) {
                    if (tips === 'expired') {
                        res.send(JSON.stringify({code: -5, detail: 'token&refreshToken过期，请重新登录'}));
                    } else if (tips === 'tokenError') {
                        res.send(JSON.stringify({code: -3, detail: '验证错误-非法refreshToken'}));
                    }
                }, function (obj) {
                    if (obj.name) {
                        res.send(JSON.stringify({code: -6, detail: 'token已过期(refresh未过期)'}));
                    } else {
                        res.send(JSON.stringify({code: -7, detail: 'refreshToken解析错误'}));
                    }
                })
            })

        } else if (tips === 'tokenError') {
            res.send(JSON.stringify({code: -3, detail: '验证错误-非法token'}));
        }
    }, function (obj) {
        if (obj.name && obj.isToken) {
            cb(obj.name);
        } else {
            res.send(JSON.stringify({code: -4, detail: 'refreshtoken不能代替token使用'}));
        }
    })
};

exports.refreshToken = function (req, res) {
    if (!req.query.refreshtoken) {
        res.send(JSON.stringify({code: -1, detail: '参数缺失:refreshtoken'}));
        return;
    }

    exports.verify(req.query.refreshtoken, function (tips) {
        if (tips === 'expired') {
            res.send(JSON.stringify({code: -5, detail: 'refreshToken过期'}));
        } else if (tips === 'tokenError') {
            res.send(JSON.stringify({code: -3, detail: '非法refreshToken'}));
        }
    }, function (obj) {
        //在这里需要检查一下，该refreshtoken是不是还存在于登录表内
        isExistRefreshToken(req.query.refreshtoken, req, res, function (rToken) {
            if (obj.name && obj.isRefreshtoken) {
                exports.setTokenToMap({name: obj.name, id: obj.id}, function (data) {
                    res.send(JSON.stringify(_.extend({code: 0}, data)));
                });
            } else {
                res.send(JSON.stringify({code: -4, detail: '非法使用token, 请使用refreshtoken刷新'}));
            }
        })
    })
};

exports.deleteAll = function(name){
  ds.deleteToken(name)
};

exports.logoutAToken = function(token, res, cb){
    ds.delAToken(token, function (results) {
        if (results.affectedRows < 1) {
            res.send(JSON.stringify({code: -2, detail: '没有对应的token,可能是已退出登录,或者修改了密码'}));
        } else {
            cb(results.affectedRows);
        }
    })
};

//一个用户可以保留多个token
function doSign(obj, time) {
    return function (cb) {
        exports.sign(obj, time, function (token) {
            cb(null, token);
        })
    }
}

function getRefreshTokenByToken(token, req, res, cb) {
    ds.queryToken(token, function (results) {
        if (results.length < 1) {
            res.send(JSON.stringify({code: -2, detail: 'token没有对应的refreshtoken,可能是已退出登录,或者修改了密码'}));
        } else {
            var u = results[0];
            cb(u.refreshtoken);
        }
    }, function (err) {
        res.send(JSON.stringify({code: -1, err: err}));
    })
}

function isExistRefreshToken(rToken, req, res, cb) {
    ds.isExistRefreshtoken(rToken, function (results) {
        if (results.length < 1) {
            res.send(JSON.stringify({code: -2, detail: '没有对应的refreshtoken,可能是已退出登录,或者修改了密码'}));
        } else {
            var u = results[0];
            cb(u.refreshtoken);
        }
    }, function (err) {
        res.send(JSON.stringify({code: -1, err: err}));
    })
}

exports.setTokenToMap = function (obj, cb) {
    obj.id = obj.id || _.uniqueId('token');
    async.parallel([
        //token
        doSign(_.extend({}, obj, {isToken: true}), "2h"),
        //refreshtoken
        doSign(_.extend({}, obj, {isRefreshtoken: true}, "15d"))
    ], function (err, results) {
        // all item callback
        //将token&refreshtoken信息存储至数据库
        ds.insertToken(obj.name, results[0], results[1]);
        cb({id: obj.id, token: results[0], refreshtoken: results[1]});
    });
}