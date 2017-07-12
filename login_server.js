const db = require("./db_conf.js");

exports.queryUser = function (name, cb, reject) {
    db.execSql(
        "select * from user where name = ?;",
        [name],
        function selectCb(err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            if (results) {
                cb(results);
            }
        }
    );
};

exports.insertUser = function (name, password, cb, reject) {
    db.execSql(
        "insert into user (name, password, registertime) values (?, ?, now());",
        [name, password],
        function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            if (results) {
                cb(results);
            }
        });
};

exports.changePasswd = function (name, password, cb, reject) {
    db.execSql(
        "update user set password = ? where name = ?;",
        [password, name],
        function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }
            if (results) {
                cb(results);
            }
        });
};


exports.setAvatar = function (url, name, cb, reject) {
    db.execSql(
        "update user set avatar = ? where name = ?;",
        [url, name],
        function (err, results, fields) {
            if (err) {
                reject && reject(err);
                return;
            }
            if (results) {
                cb && cb(results);
            }
        });
};