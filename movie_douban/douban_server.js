var db = require("../util/db_conf.js");
var _ = require("underscore");

exports.insertMovie = (obj, cb) => {
	var pObj = _.pick(obj, 'id', 'name', 'info', 'image', 'desc', 'star', 'date');//筛选过键值后的Obj
	console.log(JSON.stringify(pObj));
	pObj.gaintime = new Date();
	db.execSqlOnce("replace into movie set ? ;" , pObj, (err, results, fields)=> {
		if (err) {
			console.log("DB Error :" + err);
			cb && cb(err);
			return;
		}          
		cb && cb(null, results);
    });
};

/*----电影Api-----*/
exports.queryMovie = function (obj, cb) {
    let pObj = _.pick(obj, 'limit', 'offset');//筛选过键值后的Obj
    console.log(JSON.stringify(pObj));
    db.execSql("select * from movie where date < now() order by date desc limit ? offset ? ", [parseInt(pObj.limit), parseInt(pObj.offset)], function (err, results, fields) {
        if (err) {
            cb && cb(err);
            return;
        }
		let filterData = _.map(results, function(it){return _.omit(it, 'gaintime')});
        cb && cb(null, filterData);
    });
};