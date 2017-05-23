var express = require('express');
var app = express();
var login = require("./login.js");
var note = require("./note.js");

//设置跨域访问
app.all('/ser/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", 'guanjianli@gmail.com')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(express.static('public'));

app.get("/info", function (req, res) {
    //res.writeHead(200);
    res.end('wellcome to backend!\n');
});

//登录逻辑
login.loginInit(app);
note.noteInit(app);

//https
var https = require('https');
var fs = require("fs");
var options = {
    key: fs.readFileSync('./liguanjian.key'),
    cert: fs.readFileSync('./liguanjian.pem')
};
https.createServer(options, app).listen(443);

