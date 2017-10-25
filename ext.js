let express = require('express');
let app = express();
let login = require("./login/login.js");
let note = require("./note/note.js");
let girl = require("./other/makepicture.js");
let tz = require("./other/timezone.js");
let douban = require("./movie_douban/douban.js");
let comment = require("./comment/comment.js");
let post = require("./post/post.js");

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
    //console.error("express error:"+err.stack);
    res.status(err.status || 500);
    res.render('error', { error: err })
}
app.use(errorHandler);

app.get("/info", function (req, res) {
    //res.writeHead(200);
    res.end('wellcome to backend!\n');
});

//登录逻辑
app.use('/', login);
app.use('/', note);

//奇怪的图片下载 境内禁止
//app.use("/",girl);

//时区
app.use('/time', tz);
app.use('/movie', douban);

//评论
app.use("/comment", comment);
app.use("/post", post);

//在最后处理404?
app.use(function (req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    let err = new Error('404 Not Found');
    err['status'] = 404;
    next(err);
});

//https
let https = require('https');
let fs = require("fs");
let options = {
    key: fs.readFileSync('./liguanjian.key'),
    cert: fs.readFileSync('./liguanjian.pem')
};
https.createServer(options, app).listen(443);

