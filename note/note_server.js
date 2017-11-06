/**
 * Created by liguanjian on 2017-5-18.
 */
const db = require("../util/db_conf.js");
const _ = require("underscore");

exports.queryNote = function (name, cb) {
    db.execSql(
        "select * from note where name = ? order by time desc;",
        [name],
        cb
    );
};

exports.insertNote = function (name, note, status, cb) {
    db.execSql(
        "insert into note (name, note, status, time) values (?, ?, ?, now());",
        [name, note, status],
        cb);
};

exports.deleteNote = function (name, ids, cb) {
    db.execSql(
        "delete from note where id in (" + ids + ") and name = ?;",
        [name],
        cb);
};

exports.setStatus = function (name, status, id, cb) {
    db.execSql(
        "update note set status = ? where name = ? and id = ?;",
        [status, name, id],
        cb);
};

exports.setContent = function (name, content, id, cb) {
    db.execSql(
        "update note set note = ? where name = ? and id = ?;",
        [content, name, id],
        cb);
};
