let db = require("../util/db_conf.js");
let _ = require("underscore");

class Comment {
    insertComment(obj, cb) {
        let pObj = _.pick(obj, ['appid', 'parentid', 'content', 'subjectid', 'star', 'name']);//筛选过键值后的Obj
        pObj.time = new Date();
        db.execSqlOnce("replace into comment set ? ;select * from comment where id = @@identity ;", pObj, cb);
    }

    deleteComment(name, ids, cb) {
        //在些过滤一下邪恶的输入
        let idArr = _.compact(_.map(ids.split(','), (i)=>{return parseInt(i)})).toString();
        db.execSql(
            'delete from comment where id in (' + idArr + ') and name = "' + name + '";', cb);
    }

	getCommentOfBook(obj, cb){
		let sql = "select comment.*, user.avatar, user.id as uid, ifnull(love.islike,0) as islike from (comment left join user on comment.name=user.name) left join love on comment.id=love.commentid and user.id = love.uid where user.name = comment.name and comment.subjectid = ? order by time desc limit ? offset ?;";
        db.execSql(sql, [obj.subjectid, parseInt(obj.limit), parseInt(obj.offset)], cb);
	}

    insertLike(obj, cb) {
        let pObj = _.pick(obj, ['commentid', 'subjectid', 'uid', 'islike']);//筛选过键值后的Obj
        pObj.time = new Date();
        db.execSqlOnce("replace into love set ? ;", pObj, cb);
    }
}

module.exports = new Comment();