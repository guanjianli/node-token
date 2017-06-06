var query = require("./db_conf.js");

exports.queryUser = function (name, cb, reject) {
    query.query(
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
}

exports.insertUser = function (name, password, cb, reject) {
    query.query(
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
}

exports.changePasswd = function (name, password, cb, reject) {
    query.query(
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
    query.query(
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