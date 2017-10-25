/**
 * Created by liguanjian on 2017-7-11.
 */

let express = require('express');
let router = express.Router();
let ds = require("./post_server.js");
let _ = require("underscore");
let token = require("../login/token.js");

router.get('/', function (req, res) {
    res.send('welcome to post');
});

router.get('/add', function (req, res) {
    token.verifyToken(req, res, function (name) {
        ds.insertPost(_.extend({}, req.query, {name: name}), function (error, results) {
            if (error) {res.json({code: -1, err: error}); return;}
            if (results[0].affectedRows >= 1) {
                res.json(_.extend({code: 0, detail: '插入CMS成功!'}, {obj: results[1][0]}));
            } else {
                res.json({code: 0, detail: 'results affectedRows 0'});
            }
        })
    })
});

router.get('/del', function (req, res) {
    if (!req.query.ids) {
        res.json({code: -2, detail: '参数缺失'});
        return;
    }
    token.verifyToken(req, res, function (name) {
        ds.deletePost(name, req.query.ids, function (error, results) {
            if (error) {res.json({code: -1, err: error}); return;}
            if (results.affectedRows >= 1) {
                res.json({code: 0, detail: '删除评论成功!'});
            } else {
                res.json({code: 0, detail: 'results affectedRows 0'});
            }
        })
    })
});

router.get('/get', function (req, res) {
    token.verifyToken(req, res, function (name) {
        ds.queryPost(function (error, results) {
            if (error) {res.json({code: -1, err: error}); return;}
            res.json({code: 0, data: results});
        })
    })
});

module.exports = router;
