const fs = require("fs");
var lineReader = require('line-reader');
const _ = require("underscore");
const request = require("request");
var path = "F:\\war\\Warcraft Ⅲ\\DotA_Log\\日志\\";
var flist = fs.readdirSync(path);
flist.reverse()

var logFile = flist[0];
console.log(path + logFile)

var txlist = []
function start(){
    lineReader.eachLine(path + logFile, function(line, last) {
        if(line.indexOf(['聊天'])!=-1){
            //console.log(line);
            txlist.push(encodeURIComponent(line))
            txlist = _.uniq(txlist)
        }
    });
}

setInterval(function(){
    start();

    var tx=JSON.stringify(txlist)
    //console.log(tx)

    request('https://www.liguanjian.com/dota/set?txlist='+tx, function (error, response, body) {
        console.log('statusCode:', response && response.statusCode);
    })
}, 2000)