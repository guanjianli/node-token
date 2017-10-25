/**
 * Created by liguanjian on 2017-7-11.
 */

let express = require('express');
let router = express.Router();
let ds = require("./douban_server.js");
let _ = require("underscore");

router.get('/', function (req, res) {
    res.send('welcome to movie');
});

router.get('/list', function (req, res) {
    if (!req.query.limit || !req.query.offset) {
        res.json({code: -2, detail: 'limit offset参数缺失'});
    }else {
        ds.queryMovie({limit:req.query.limit, offset:req.query.offset}, function (err, results) {
            if(err){
                res.json(_.extend({code: -1}, {err:err}));
                return;
            }
            results = _.map(results, function(it){return _.omit(it, 'gaintime')});
            res.json({code: 0, data: results});
        })
    }
});

module.exports = router;
