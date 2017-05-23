/**
 * Created by liguanjian on 2017-5-18.
 */
var fs = require("fs");
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var _ = require("underscore");
var async = require("async");

// sign with RSA SHA256
var priCert = fs.readFileSync('./liguanjian.key');  // get private key
var pubCert = fs.readFileSync('./liguanjian.pem');  // get public key


exports.sign = function (obj, expiresIn, cb) {
    jwt.sign(obj, priCert, {algorithm: 'RS256', expiresIn: expiresIn}, function (err, token) {
        cb(token);
    });
};

exports.verify = function (token, errCb, done) {
    jwt.verify(token, pubCert, {algorithms: ['RS256']}, function (err, decoded) {
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
            var dcode = jwt.decode(req.query.token);
            if (!exports.tokenMap[dcode.name] || !exports.tokenMap[dcode.name][dcode.id]) {
                res.send(JSON.stringify({code: -1, detail: 'refreshToken已失效'}));
                return;
            }
            var refreshToken = exports.tokenMap[dcode.name][dcode.id]["refreshtoken"];
            exports.verify(refreshToken, function (tips) {
                if (tips === 'expired') {
                    res.send(JSON.stringify({code: -5, detail: 'token&refreshToken过期，请重新登录'}));
                } else if (tips === 'tokenError') {
                    res.send(JSON.stringify({code: -3, detail: '验证错误-非法refreshToken'}));
                }
            }, function (obj) {
                if (obj.name) {
                    res.send(JSON.stringify({code: -6, detail: 'token已过期，refresh未过期'}));
                } else {
                    res.send(JSON.stringify({code: -7, detail: 'refreshToken解析错误'}));
                }
            })
        } else if (tips === 'tokenError') {
            res.send(JSON.stringify({code: -3, detail: '验证错误-非法token'}));
        }
    }, function (obj) {
        if (obj.name) {
            cb(obj.name);
        } else {
            res.send(JSON.stringify({code: -4, detail: 'token解析错误'}));
        }
    })
};

exports.refreshToken = function (req, res) {
    if (!req.query.refreshtoken) {
        res.send(JSON.stringify({code: -1, detail: '参数缺失:refreshtoken'}));
        return;
    }
    var dcode = jwt.decode(req.query.refreshtoken);
    //res.send(JSON.stringify(exports.tokenMap));
    if (!exports.tokenMap[dcode.name] || !exports.tokenMap[dcode.name][dcode.id]) {
        res.send(JSON.stringify({code: -2, detail: 'refreshToken已失效'}));
        return;
    }

    exports.verify(req.query.refreshtoken, function (tips) {
        if (tips === 'expired') {
            res.send(JSON.stringify({code: -5, detail: 'refreshToken过期'}));
        } else if (tips === 'tokenError') {
            res.send(JSON.stringify({code: -3, detail: '非法refreshToken'}));
        }
    }, function (obj) {
        if (obj.name && obj.refreshtoken) {
            exports.setTokenToMap({name: obj.name, id: obj.id}, function (data) {
                res.send(JSON.stringify({code: 0, data: data}));
            });
        } else {
            res.send(JSON.stringify({code: -4, detail: '非法使用token, 请使用refreshtoken刷新'}));
        }
    })
};

exports.tokenMap = {};
//一个用户可以保留多个token
function doSign(obj, time) {
    return function (cb) {
        exports.sign(obj, time, function (token) {
            var newObj = _.extend(obj, {token: token});
            exports.tokenMap[newObj.name] = {};
            exports.tokenMap[newObj.name][obj.id] = {};
            exports.tokenMap[newObj.name][obj.id]["refreshtoken"] = token;
            cb(null, token);
        })
    }
}
exports.setTokenToMap = function (obj, cb) {
    obj.id = obj.id || _.uniqueId('token');
    async.series([
        //token
        doSign(_.extend({}, obj, {token: true}), "2h"),
        //refreshtoken
        doSign(_.extend({}, obj, {refreshtoken: true}, "15d"))
    ], function (err, results) {
        // all item callback
        cb({id: obj.id, token: results[0], refreshtoken: results[1]});
    });
}