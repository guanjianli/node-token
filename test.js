var express = require('express');
var app = express();
var upload = require("./imageupload");

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

