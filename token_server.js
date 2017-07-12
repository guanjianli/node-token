/**
 * Created by liguanjian on 2017-5-26.
 */
let db = require("./db_conf.js");
exports.insertToken = function (name, token, refreshtoken, cb, reject) {
    db.execSql(
        "insert into token (name, token, refreshtoken, time) values (?, ?, ?, now());",
        [name, token, refreshtoken],
        function (err, results, fields) {
            if (err) {
                console.log(err);
                reject && reject(err);
                return;
            }
            if (results) {
                cb && cb(results);
            }
        });
};

exports.queryToken = function (token, cb, reject) {
    db.execSql(
        "select * from token where token = ?;",
        [token],
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

exports.isExistRefreshtoken = function (rToken, cb, reject) {
    db.execSql(
        "select * from token where refreshtoken = ?;",
        [rToken],
        function selectCb(err, results, fields) {
            if (err) {
                reject && reject(err);
                return;
            }
            if (results) {
                cb && cb(results);
            }
        }
    );
};

exports.deleteToken = function (name, cb, reject) {
    db.execSql(
        "delete from token where name = ?;",
        [name],
        function selectCb(err, results, fields) {
            if (err) {
                reject && reject(err);
                return;
            }
            if (results) {
               cb && cb(results);
            }
        }
    );
};

exports.delAToken = function (token, cb, reject) {
    db.execSql(
        "delete from token where token = ?;",
        [token],
        function selectCb(err, results, fields) {
            if (err) {
                reject && reject(err);
                return;
            }
            if (results) {
                cb && cb(results);
            }
        }
    );
};