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
                // for(var i = 0; i < results.length; i++)
                // {
                //   //console.log("%d\t%s\t%s", results[i].id, results[i].content, results[i].score);
                // }
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
        [password,name],
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