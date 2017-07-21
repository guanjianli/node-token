/**
 * Created by liguanjian on 2017-7-11.
 */

let express = require('express');
let router = express.Router();
let ds = require("./comment_server.js");
let _ = require("underscore");
let token = require("../login/token.js");

router.get('/', function (req, res) {
    res.send('welcome to comment');
});

router.get('/add', function (req, res) {
    if (!req.query.content || !req.query.appid) {
        res.send(JSON.stringify({code: -2, detail: '参数缺失'}));
        return;
    }
    token.verifyToken(req, res, function (userName) {
        ds.insertComment(_.extend({}, req.query, {username: userName}), function (error, results) {
            if (error) res.send(JSON.stringify({code: -1, err: error}));
            if (results.affectedRows >= 1) {
                res.send(JSON.stringify({code: 0, detail: '插入评论成功!'}));
            } else {
                res.send(JSON.stringify({code: 0, detail: 'results affectedRows 0'}));
            }
        })
    })
});

router.get('/del', function (req, res) {
    if (!req.query.ids) {
        res.send(JSON.stringify({code: -2, detail: '参数缺失'}));
        return;
    }
    token.verifyToken(req, res, function (name) {
        ds.deleteComment(name, req.query.ids, function (error, results) {
            if (error) res.send(JSON.stringify({code: -1, err: error}));
            if (results.affectedRows >= 1) {
                res.send(JSON.stringify({code: 0, detail: '删除评论成功!'}));
            } else {
                res.send(JSON.stringify({code: 0, detail: 'results affectedRows 0'}));
            }
        })
    })
});

router.get('/get', function (req, res) {
    if (!req.query.ids) {
        res.send(JSON.stringify({code: -2, detail: '参数缺失'}));
        return;
    }
    ds.queryCommentByList(req.query.ids, function (error, results) {
        if (error) res.send(JSON.stringify({code: -1, err: error}));
        res.send(JSON.stringify({code: 0, data: results}));
    })

});

module.exports = router;
