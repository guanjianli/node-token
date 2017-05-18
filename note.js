/**
 * Created by liguanjian on 2017-5-18.
 */
var ds = require("./note_server.js");
var token = require("./token.js");

function noteInit(app) {
    app.get('/ser/note', function (req, res) {
        token.verifyToken(token, req, res, function (name) {
            ds.queryUser(name, function (data) {
                res.send(JSON.stringify({code: 0, data: data}));
            }, function () {
                res.send(JSON.stringify({code: -1, err: err}));
            })
        })
    });
    app.get('/ser/addnote', function (req, res) {
        token.verifyToken(token, req, res, function (name) {
            if (!req.query.token || !req.query.note) {
                res.send(JSON.stringify({code: -5, detail: '参数缺失'}));
                return;
            }
            ds.insertNote(name, req.query.note, req.query.status ? req.query.status : 1, function (results) {
                if (results.affectedRows >= 1) {
                    res.send(JSON.stringify({code: 0, detail: '插入笔记成功!'}));
                } else {
                    res.send(JSON.stringify({code: 0, detail: '插入笔记错误!'}));
                }
            }, function (erro) {
                res.send(JSON.stringify({code: -1, err: erro}));
            })
        })
    });
}

exports.noteInit = noteInit;