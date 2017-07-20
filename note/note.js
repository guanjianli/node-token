/**
 * Created by liguanjian on 2017-5-18.
 */
var ds = require("./note_server.js");
var token = require("../login/token.js");
var router = require("express").Router();

router.get('/ser/note', function (req, res) {
    token.verifyToken(req, res, function (name) {
        ds.queryUser(name, function (data) {
            res.send(JSON.stringify({code: 0, data: data}));
        }, function (err) {
            res.send(JSON.stringify({code: -1, err: err}));
        })
    })
});
router.get('/ser/addnote', function (req, res) {
    if (!req.query.note) {
        res.send(JSON.stringify({code: -2, detail: '参数缺失'}));
        return;
    }
    token.verifyToken(req, res, function (name) {
        ds.insertNote(name, req.query.note, req.query.status ? req.query.status : 1, function (results) {
            if (results.affectedRows >= 1) {
                res.send(JSON.stringify({code: 0, detail: '插入笔记成功!'}));
            } else {
                res.send(JSON.stringify({code: 0, detail: 'results affectedRows 0'}));
            }
        }, function (erro) {
            res.send(JSON.stringify({code: -1, err: erro}));
        })
    })
});
router.get('/ser/deletenote', function (req, res) {
    if (!req.query.ids) {
        res.send(JSON.stringify({code: -2, detail: '参数缺失'}));
        return;
    }
    token.verifyToken(req, res, function (name) {
        ds.deleteNote(name, req.query.ids, function (results) {
            if (results.affectedRows >= 1) {
                res.send(JSON.stringify({code: 0, detail: '删除笔记成功!'}));
            } else {
                res.send(JSON.stringify({code: 0, detail: 'results affectedRows 0'}));
            }
        }, function (err) {
            res.send(JSON.stringify({code: -1, err: err}));
        })
    })
});
router.get('/ser/notestatus', function (req, res) {
    token.verifyToken(req, res, function (name) {
        if (!req.query.status || !req.query.id) {
            res.send(JSON.stringify({code: -2, detail: '参数缺失'}));
            return;
        } else {
            ds.setStatus(name, req.query.status, req.query.id, function (results) {
                if (results.affectedRows >= 1) {
                    res.send(JSON.stringify({code: 0, detail: '设置笔记状态成功!'}));
                } else {
                    res.send(JSON.stringify({code: 0, detail: 'results affectedRows 0'}));
                }
            }, function (err) {
                res.send(JSON.stringify({code: -1, err: err}));
            })
        }
    })
});
router.get('/ser/notecontent', function (req, res) {
    token.verifyToken(req, res, function (name) {
        if (!req.query.content || !req.query.id) {
            res.send(JSON.stringify({code: -2, detail: '参数缺失'}));
            return;
        } else {
            ds.setContent(name, req.query.content, req.query.id, function (results) {
                if (results.changedRows >= 1) {
                    res.send(JSON.stringify({code: 0, detail: '设置笔记内容成功!'}));
                } else {
                    res.send(JSON.stringify({code: 0, detail: 'results changedRows 0'}));
                }
            }, function (err) {
                res.send(JSON.stringify({code: -1, err: err}));
            })
        }
    })
});


module.exports = router;