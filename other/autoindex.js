/**
 * Created by liguanjian on 2017-5-27.
 */

var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");

var serveIndex = require('serve-index')
app.use('/log', express.static('public'), serveIndex('public', {'icons': true}))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true, limit:'100mb' })); // for parsing application/x-www-form-urlencoded

//app.use('/public',express.static('public'));//将文件设置成静态


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});