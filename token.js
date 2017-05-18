/**
 * Created by liguanjian on 2017-5-18.
 */
var fs = require("fs");

// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');

// sign with RSA SHA256
var priCert = fs.readFileSync('./liguanjian.key');  // get private key
var pubCert = fs.readFileSync('./liguanjian.pem');  // get public key


exports.sign = function (obj, cb) {
    jwt.sign(obj, priCert, { algorithm: 'RS256', expiresIn: "1h" }, function(err, token) {
        cb(token);
    });
};

exports.verify = function (token, errCb, done) {
    jwt.verify(token, pubCert, { algorithms: ['RS256'] }, function(err, decoded) {

        if(err && (err.name == 'TokenExpiredError')){
            errCb("expired");
        }else if(err && (err.name == 'JsonWebTokenError')){
            errCb("tokenError");
        }else if(!err) {
            done(decoded);
        }else {
            errCb(err);
        }
    });
};

//所有的token来此验证 express
exports.verifyToken =function(token, req, res, cb) {
    if (!req.query.token) {
        res.send(JSON.stringify({code: -2, detail: 'token缺失'}));
        return;
    }
    exports.verify(req.query.token, function (tips) {
        if (tips === 'expired') {
            res.send(JSON.stringify({code: -2, detail: 'token过期，请重新登录'}));
        } else if (tips === 'tokenError') {
            res.send(JSON.stringify({code: -3, detail: 'token 验证错误'}));
        }
    }, function (obj) {
        if (obj.name) {
            cb(obj.name);
        } else {
            res.send(JSON.stringify({code: -4, detail: 'token解析错误'}));
        }
    })
}