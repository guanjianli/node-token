let db = require("../util/db_conf.js");
let _ = require("underscore");

class Comment {
    public insertComment(obj, cb) {
        let pObj = _.pick(obj, ['appid', 'parentid', 'content']);//筛选过键值后的Obj
        pObj.time = new Date();
        console.log(JSON.stringify(pObj));
        db.execSqlOnce("replace into comment set ? ;", pObj, (err, results, fields) => {
            if (err) {
                console.log("DB Error :" + err);
                cb && cb(err);
                return;
            }
            cb && cb(null, results);
        });
    }

    public queryComment(obj, cb) {
        let p = _.map(obj, (v, k) => {
            return (k + ' = "' + v + '"')
        }).join(" and ");
        db.execSql(
            "select * from user where ?;",
            [p],
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

    public deleteComment(useName, ids, cb) {
        db.execSql(
            "delete from comment where id in (" + ids + ") and name = " + query.pool.escape(useName) + ";",
            function (err, results, fields) {
                if (err) {
                    reject && reject(err);
                    return;
                }
                if (results) {
                    cb && cb(null, results);
                }
            });
    }
}

module.exports = new Comment();