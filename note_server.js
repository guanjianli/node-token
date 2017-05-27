/**
 * Created by liguanjian on 2017-5-18.
 */
var query = require("./db_conf.js");


exports.queryUser = function (name, cb, reject) {
    query.query(
        "select * from note where name = ?;",
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

exports.insertNote = function (name, note, status, cb, reject) {
    query.query(
        "insert into note (name, note, status, time) values (?, ?, ?, now());",
        [name, note, status],
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

exports.deleteNote = function (name, ids, cb, reject) {
    query.query(
        "delete from note where id in (" + ids + ") and name = " + query.pool.escape(name) + ";",
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

exports.setStatus = function (name, status, id, cb, reject) {
    query.query(
        "update note set status = ? where name = ? and id = ?;",
        [status, name, id],
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

exports.setContent = function (name, content, id, cb, reject) {
    query.query(
        "update note set note = ? where name = ? and id = ?;",
        [content, name, id],
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