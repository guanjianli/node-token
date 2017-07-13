/**
 * Created by liguanjian on 2017-7-11.
 */

var express = require('express');
var router = express.Router();
var ser = require("./note/note_server.js");
var _ = require("underscore");

router.get('/', function (req, res) {
    res.send('welcome to movie');
});

router.get('/list', function (req, res) {
    if (!req.query.limit || !req.query.offset) {
        res.json({code: -2, detail: 'limit offset参数缺失'});
        return;
    }else {
        ser.queryMovie({limit:req.query.limit, offset:req.query.offset}, function (err, results) {
            if(err){
                res.json(_.extend({code: -1001}, {err:err}));
                return;
            }
            res.json({code: 0, data: results});
        })
    }

});

module.exports = router;
