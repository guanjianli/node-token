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
}

exports.insertNote = function (name, note, status, cb, reject) {
    query.query(
        "insert into note (name, note, status) values (?, ?, ?);",
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
}