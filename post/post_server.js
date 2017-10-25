let db = require("../util/db_conf.js");
let _ = require("underscore");

class Post {
    insertPost(obj, cb) {
        let pObj = _.pick(obj, ['author', 'content', 'imgurl', 'title']);//筛选过键值后的Obj
        pObj.time = new Date();
        db.execSqlOnce("replace into post set ? ;select * from post where id = @@identity ;", pObj, cb);
    }

    deletePost(name, ids, cb) {
        //在些过滤一下邪恶的输入
        let idArr = _.compact(_.map(ids.split(','), (i) => {
            return parseInt(i)
        })).toString();
        db.execSql('delete from post where id in (' + idArr + ') and name = "' + name + '";', cb);
    }

    queryPost(cb) {
        db.execSql("select * from post order by time desc;", cb);
    };

}

module.exports = new Post();