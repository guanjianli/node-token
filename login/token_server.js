/**
 * Created by liguanjian on 2017-5-26.
 */
let db = require("../util/db_conf.js");
exports.insertToken = function (name, token, refreshtoken, cb, reject) {
    db.execSql(
        "insert into token (name, token, refreshtoken, time) values (?, ?, ?, now());", [name, token, refreshtoken], cb);
};

exports.queryToken = function (token, cb) {
    db.execSql("select * from token where token = ?;", [token], cb);
};

exports.isExistRefreshtoken = function (rToken, cb) {
    db.execSql("select * from token where refreshtoken = ?;", [rToken], cb);
};

exports.deleteToken = function (name, cb) {
    db.execSql("delete from token where name = ?;", [name], cb);
};

exports.delAToken = function (token, cb) {
    db.execSql("delete from token where token = ?;", [token], cb);
};