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
	/*
    if (!req.query.appid) {
        res.json({code: -2, detail: '参数缺失'});
        return;
    }*/
    token.verifyToken(req, res, function (name) {
        ds.insertComment(_.extend({}, req.query, {name: name}), function (error, results) {
            if (error) {res.json({code: -1, err: error}); return;}
            if (results[0].affectedRows >= 1) {
                res.json(_.extend({code: 0, detail: '插入评论成功!'}, {obj:results[1][0]}));
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
        ds.deleteComment(name, req.query.ids, function (error, results) {
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
    if (!req.query.ids) {
        res.json({code: -2, detail: '参数缺失'});
        return;
    }
    ds.queryCommentByList(req.query.ids, function (error, results) {
        if (error) {res.json({code: -1, err: error}); return;}
        res.json({code: 0, data: results});
    })

});

router.get('/movie', function (req, res) {
    if (!req.query.subjectid || !req.query.limit || !req.query.offset) {
        res.json({code: -2, detail: '参数缺失'});
        return;
    }
    ds.getCommentOfBook(req.query, function (error, results) {
        if (error) {res.json({code: -1, err: error}); return;}
        res.json({code: 0, data: results});
    })
});

router.get('/like', function (req, res) {
    if (!req.query.commentid || !req.query.islike) {
        res.json({code: -2, detail: '参数缺失'});
        return;
    }
    token.verifyToken(req, res, function (name, uid) {
        if(!uid){
            res.json({code: -1, detail: '请重新登录'});
            return;
        }
        ds.insertLike(_.extend({},req.query, {uid:uid}), function (error, results) {
            if (error) {res.json({code: -1, err: error}); return;}
            res.json({code: 0, detail: '成功!'});
        })
    });
});

module.exports = router;
