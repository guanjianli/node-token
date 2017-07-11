var express = require('express');
var app = express();
var login = require("./login.js");
var note = require("./note.js");
var girl = require("./makepicture.js");
var tz = require("./timezone.js");
var douban = require("./douban.js");


//设置跨域访问
app.all('/ser/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", 'guanjianli@gmail.com');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "token,ext");
    next();
});

app.use(express.static('public'));


//多个错误传递，参见https://expressjs.com/en/guide/error-handling.html
function errorHandler (err, req, res, next) {
    console.error("express error:"+err.stack);
    res.status(err.status || 500);
    res.render('error', { error: err })
}
app.use(errorHandler);

app.get("/info", function (req, res) {
    //res.writeHead(200);
    res.end('wellcome to backend!\n');
});

//登录逻辑
login.loginInit(app);
note.noteInit(app);

//奇怪的图片下载
girl.init(app);

//时区
tz.init(app);

app.use('/movie', douban);

//在最后处理404?
app.use(function (req, res, next) {
    var err = new Error('404 Not Found');
    err['status'] = 404;
    next(err);
});

//https
var https = require('https');
var fs = require("fs");
var options = {
    key: fs.readFileSync('./liguanjian.key'),
    cert: fs.readFileSync('./liguanjian.pem')
};
https.createServer(options, app).listen(443);

