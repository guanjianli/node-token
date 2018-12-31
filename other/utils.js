const fs = require("fs");
const request = require("request");
const _ = require("underscore");
const readline = require("readline");

module.exports.saveJSONFile = (fileUrl, jsonObj) =>{
    let path = fileUrl.match(/(.*)\/[^\/]+$/)[1];
    module.exports.mkdirExistsSync(path);
    fs.writeFileSync(fileUrl, JSON.stringify(jsonObj));
};

/*
* option
*  output 如果是以/结尾,为文件夹 非为文件
*  fileName 重新命名文件名 前提是output是文件夹
* */
module.exports.downloadHttpFileRemote = (url, option, cb) =>{
    let fileName = url.match(/.*\/([^\/]+)$/)[1];
    let out = option.output.match(/(.*\/)[^\/]+$/);//如果匹配,为有文件的后缀格式,如果有/结尾,为文件夹
    module.exports.mkdirExistsSync(out ? out[1] : option.output);
    let outFileName = out ? option.output : option.output + (option.rename || fileName);
    request({
        url:url,
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
            "Referer":option.referer || "",
            "Cache-Control":"no-cache",
            "Cookie":option.cookie || ""
        }
    }).on("response", (response) =>{
        console.log(response.statusCode); // 200
        console.log(response.headers); // 'image/png'
    }).pipe(fs.createWriteStream(outFileName)).on("finish", () =>{
        cb && cb(outFileName);
    }).on("error", () =>{
        console.log("file createWriteStream error");
    });
};
//传入一个数组,找出配置中未含有的列表
module.exports.diffDoneConf = (confUrl, checkList) =>{
    checkList = Array.isArray(checkList) ? checkList : [checkList];
    module.exports.touchFile(confUrl);
    let data = fs.readFileSync(confUrl).toString() || "[]";
    return _.difference(checkList, JSON.parse(data.toString()));
};
//保存已完成的列表到配置
module.exports.flagDoneConf = (confUrl, doneList) =>{
    doneList = Array.isArray(doneList) ? doneList : [doneList];
    module.exports.touchFile(confUrl);
    let data = fs.readFileSync(confUrl).toString() || "[]";
    try{
        fs.writeFileSync(confUrl, JSON.stringify(_.union(doneList, JSON.parse(data.toString().trim()))));
    }catch(e){
        console.log(e);
    }

};
//创建一个空文件,如不存在目录,先创建目录
module.exports.touchFile = (fileUrl) =>{
    if(!fs.existsSync(fileUrl)){
        if(fileUrl.match(/\/.*\//)){
            let path = fileUrl.match(/(.*\/)[^\/]+$/)[1];
            !fs.existsSync(path) && fs.mkdirSync(path);
        }
        fs.writeFileSync(fileUrl, "");
    }
};

module.exports.mkdirExistsSync = (path) =>{
    !fs.existsSync(path) && fs.mkdirSync(path);
};

//序列执行多个promise
module.exports.queue = async(promises) =>{
    let res = Promise.resolve();
    for(let promise of promises){
        res = await promise(res);
    }
    return await res;
};
//不重复id
module.exports.noRepeat = (conf, id, cb) =>{
    if(module.exports.diffDoneConf(conf, id).length > 0){
        cb(id);
    }else{
        cb();
    }
};

module.exports.loadPage = (url) =>{
    return new Promise((resolve, reject) =>{
        request(url, function(error, response, body){
            console.log("statusCode:", response && response.statusCode);
            if(body){
                resolve(body);
            }
        });
    });
};

module.exports.readLine = (fileUrl, eachCallback, regExp, completeCallback) =>{
    const rl = readline.createInterface({
        input:fs.createReadStream(fileUrl),
        crlfDelay:Infinity
    });
    rl.on("line", (line) =>{
        if(regExp){
            let r = new RegExp(regExp);
            if(line.match(r)){
                // console.log(line);
                eachCallback && eachCallback(line);
            }
        }else{
            eachCallback && eachCallback(line);
        }
    });
    rl.on("close", () =>{
        console.log("all complete");
        completeCallback && completeCallback()
    });
};