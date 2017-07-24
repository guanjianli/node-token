let db = require("../util/db_conf.js");
let _ = require("underscore");

class Comment {
    insertComment(obj, cb) {
		console.log("app send to me subjectid", obj.subjectid);
        let pObj = _.pick(obj, ['appid', 'parentid', 'content', 'subjectid', 'star', 'name']);//筛选过键值后的Obj
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
		let sql = "select comment.*, user.avatar, user.id as uid from  comment, user where user.name = comment.name and comment.id in (" + ids + ");";
        db.execSql(
            sql,
            function selectCb(err, results, fields) {
                if (err) {
                    cb && cb(err);
                    return;
                }
                cb && cb(null, results);
            }
        );
    }

    deleteComment(name, ids, cb) {
        db.execSql(
            'delete from comment where id in (' + ids + ') and name = "' + name + '";',
            function (err, results, fields) {
                if (err) {
                    cb && cb(err);
                    return;
                }
                cb && cb(null, results);
            });
    }
	
	getCommentOfBook(obj, cb){
		let sql = "select comment.*, user.avatar, user.id as uid from  comment, user where user.name = comment.name and comment.subjectid = ? limit ? offset ?;";
        db.execSql(
            sql,
			[obj.subjectid, parseInt(obj.limit), parseInt(obj.offset)],
            function selectCb(err, results, fields) {
                if (err) {
                    cb && cb(err);
                    return;
                }
                cb && cb(null, results);
            }
        );
	}
}

module.exports = new Comment();