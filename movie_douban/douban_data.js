
var request = require('request');
const cheerio = require('cheerio');
const fs = require("fs");
const _ = require("underscore");
const async = require("async");
const ds = require("./douban_server.js");

var filePath = './done.json'
//先读旧的文件
var oldList = JSON.parse(fs.readFileSync(filePath, 'utf8'));

var getMovieUrl = function(cb){
    
    request('https://movie.douban.com/', function (error, response, body) {
	  if(error){console.log(error);return;}
      if(response.statusCode != 200) console.log('statusCode:', response && response.statusCode); 
	  if(body){		
		  //const $ = cheerio.load(body);
          var m = body.match(/https[^http]+subject\/\d+\//g);
          //console.log(m)
          var l = _.uniq(m); // 对拿到的url，先进行去重
          
          //找出l中比oldList多的差集
          var diff = _.difference(l, oldList);    
          handleDiff(diff);
	  }
    });
};

var handleDiff = (difMap)=>{
     //console.log(difMap);
     var l ;
     l = difMap.map((it)=>{
        return (cb)=>{
            requestDetail(it, cb)
        }
     });
    async.parallel(l, (err, results) => {
        console.log("all done ", results.length);
		if(err){
			console.log("some thingworng")
			return;
		}
		//如中途出错，数据库更新，但是不写入done文件
		fs.writeFileSync(filePath, JSON.stringify(_.uniq(oldList)));
    });
}

var requestDetail = (url, cb)=>{
    request(url, function (error, response, body) {
	  if(error){console.log(error);return;}
      if(response.statusCode != 200) console.log('statusCode:', response && response.statusCode, url); 
	  if(body){		
		  const $ = cheerio.load(body);
          var name = $("h1 span").text();
          var info = $("#info").text().split("\n").map((it)=>{
             return decodeURI(it.replace(/(^\s+)|(\s+$)/g,""));//去掉前后空格
          });
          info = _.compact(info).toString();//返回一个除去所有false值的 array副本。 在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.
          var img = $("#mainpic img").attr("src");
		  var id = url.match(/[^\/]\d+/g)[0];
		  var desc = $("#link-report").text().replace(/(^\s+)|(\s+$)/g,"");
		  var star = $(".rating_num").text();
          var date = info.match(/\d+-\d+-\d+/g);
		  if(!name){
			  cb(new Error("no get data of movie's name"));
			  return;
		  }
          var obj = _.extend({'id':id, 'name':name}, {'info':info}, {'image':img}, {'desc':desc, 'star':star, 'date': (date && date.length > 0) ? date[0]:""});
          //console.log(JSON.stringify(obj))
          //完成之后，合并到旧文件。
		  ds.insertMovie(obj);
		  oldList.push(url);
          cb(null, url);
	  }else{
          cb(new Error("no reachable"))
      }
    });
}
                      
getMovieUrl();
//handleDiff(oldList);
