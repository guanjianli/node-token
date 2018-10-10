let request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const _ = require("underscore");

let save = function(cb){
    request("http://www.sex.com/pics/asian/?sort=latest", function(error, response, body){
        //console.log('error:', error); // Print the error if one occurred
        console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        if(body){
            const $ = cheerio.load(body);
            let imgs = $("#container img");//.slice(0, 50);
            console.log("imgs:", imgs.length);
            let list = [];
            imgs.map(function(i, el){
                let tx = $(this).attr("data-src");
                tx = tx.replace("\/300\/", "\/620\/");
                tx && list.push(tx);
            });
            list = _.uniq(list);//先去重
            let confUrl = "./girl.json";
            fs.readFile(confUrl, (err, data) =>{
                if(err){
                    if(err){
                        console.error(err);
                        return;
                    }
                    throw err;
                }else{
                    let oldList = JSON.parse(data);
                    let newContent = _.difference(list, oldList);
                    saveJSONFile(confUrl, _.union(newContent, oldList));
                    downloadList(newContent);
                }
            });
        }
    });
};

let saveJSONFile = (fileUrl, jsonObj, cb) =>{
    fs.writeFile(fileUrl, JSON.stringify(jsonObj), (err) =>{
        if(err) throw err;
        cb && cb();
        console.log("The file has been saved!");
    });
};
let downloadList = (list) =>{
    for(let i = 0; i < list.length; i++){
        let obj = list[i];
        downloadFileRemote(obj);
    }
};
//有点.加后缀的文件
let downloadFileRemote = (url) =>{
    let fileName = new Date().getTime() + "x" + url.match(/.*\/([^\/]+)$/)[1];
    request
        .get(url)
        .on("error", function(err){
            console.log(err);
        })
        .pipe(fs.createWriteStream("./image/" + fileName));
};
save();