let db = require("../util/db_conf.js");
let _ = require("underscore");

class Comment {
    insertComment(obj, cb) {
        let pObj = _.pick(obj, ['appid', 'parentid', 'content', 'subjectid', 'star']);//筛选过键值后的Obj
        pObj.time = new Date();
        db.execSqlOnce("replace into comment set ? ;", pObj, (err, results, fields) => {
            if (err) {
                console.log("DB Error :" + err);
                cb && cb(err);
                return;
            }
            cb && cb(null, results);
        });
    }

    queryComment(obj, cb) {
        let p = _.map(obj, (v, k) => {
            return (k + ' = "' + v + '"')
        }).join(" and ");
        db.execSql(
            "select * from comment where ?;",
            [p],
            function selectCb(err, results, fields) {
                if (err) {
                    cb && cb(err);
                    return;
                }
                cb && cb(null, results);
            }
        );
    }

    queryCommentByList(ids, cb) {
        db.execSql(
            "select * from comment where id in (" + ids + ");",
            [ids],
            function selectCb(err, results, fields) {
                if (err) {
                    cb && cb(err);
                    return;
                }
                cb && cb(null, results);
            }
        );
    }

    deleteComment(useName, ids, cb) {
        db.execSql(
            "delete from comment where id in (" + ids + ") and name = " + query.pool.escape(useName) + ";",
            function (err, results, fields) {
                if (err) {
                    cb && cb(err);
                    return;
                }
                cb && cb(null, results);
            });
    }
}

module.exports = new Comment();