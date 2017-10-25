const db = require("../util/db_conf.js");
const _ = require("underscore");

exports.queryUser = function (name, cb) {
    db.execSql("select * from user where name = ?;", [name], cb);
};

exports.queryUserByID = function (id, cb) {
    db.execSql("select * from user where id = ?;", [id], cb);
};

exports.insertUser = function (name, password, cb) {
    db.execSql("insert into user (name, password, registertime) values (?, ?, now());", [name, password], cb);
};

exports.changePasswd = function (name, password, cb) {
    db.execSql("update user set password = ? where name = ?;", [password, name], cb);
};


exports.setAvatar = function (url, name, cb) {
    db.execSql("update user set avatar = ? where name = ?;", [url, name], cb);
};