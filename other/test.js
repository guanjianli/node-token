var express = require('express');
var app = express();
var upload = require("../util/imageupload");

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "token,a,b,c");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", 'guanjianli@gmail.com')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(express.static('public'));
app.set('view engine', 'html');

app.get("/info", function (req, res) {
    //res.writeHead(200);
    res.end('wellcome to backend!\n' + req.header('token') + req.header('a'));
});

app.get('/upit', function (req, res) {
    res.header("Content-Type", "text/html;charset=utf-8");
    res.end('<form action="/upload" role="form" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="fileUp" />' +
        '<button id="btnSub" type="submit">上 传</button>' +
        '</form>');
})

app.post('/upload', function (req, res) {
    upload.upload(req,res);
});

app.listen(411);

let db = require("./db_conf.js");
let _ = require("underscore");

exports.queryData = function (obj, cb) {
    let pObj = _.pick(obj, ['id', 'val']);//筛选过键值后的Obj
    console.log(JSON.stringify(pObj));
    db.execSqlOnce("select * from movie order by date desc;", [pObj], function (err, results, fields) {
        if (err) {
            cb && cb(err);
            return;
        }
        console.log(results);
        cb && cb(null, results);
    });
};
exports.insertData = (obj, cb) => {
    let pObj = _.pick(obj, ['id', 'val']);//筛选过键值后的Obj
    console.log(JSON.stringify(pObj));
    db.execSqlOnce("replace into test set ? ;", pObj, (err, results, fields) => {
        if (err) {
            cb && cb(err);
            return;
        }
        cb && cb(null, results);
    });
};

exports.insertData({id:1, val:17});
//exports.queryData({id:1,val:7});