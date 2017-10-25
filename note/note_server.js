/**
 * Created by liguanjian on 2017-5-18.
 */
const db = require("../util/db_conf.js");
const _ = require("underscore");

exports.queryUser = function (name, cb, reject) {
    db.execSql(
        "select * from note where name = ? order by time desc;",
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
    db.execSql(
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
    db.execSql(
        "delete from note where id in (" + ids + ") and name = ?;",
		[name],
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
    db.execSql(
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
    db.execSql(
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
