var express = require('express');
var app = express();


//…Ë÷√øÁ”Ú∑√Œ 
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "token,a,b,c");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", 'guanjianli@gmail.com')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(express.static('public'));

app.get("/info", function (req, res) {
    //res.writeHead(200);
    res.end('wellcome to backend!\n'+req.header('token')+req.header('a'));
});


app.listen(411)

