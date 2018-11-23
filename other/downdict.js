let request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const utils = require("./utils");

let dictid = [];
let url = "http://gameui.matme.info/blog/";
let requestQueue = [];
let loopSta = 0;

let header = {
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
    "Referer":"http://www.lingoes.cn",
    "Cache-Control":"no-cache",
    "Cookie":"ul=en; PHPSESSID=kvap9fhdnh2h0o6dhoc55878m6; bwm_uid=s+b4mSsHapV4qf2vxoIK0Q=="
};

let loopDo = () =>{
    let task = requestQueue.pop();
    task && task();
};

let taskNext = () =>{
    if(requestQueue.length > 1){
        loopDo();
        loopSta = 1;
    }else{
        loopSta = 0;
    }
};

loopDoRestart = () =>{
    if(!loopSta && requestQueue.length >= 1){
        loopDo();
    }
};
let pushTask = (f) =>{
    requestQueue.push(f);
    // loopDoRestart();//如果没有正在运行的,检查是否可重启
};

let findlist = (pageId) =>{
    let url = `http://www.lingoes.cn/zh/dictionary/dict_update.php?page=${pageId}&order=1`;
    let f = () =>{
        request(url, (error, response, body) =>{
            //console.log('error:', error); // Print the error if one occurred
            console.log("pageurl====", url);
            console.log("page=======statusCode:", response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.
            if(response && response.statusCode == 200){
                if(body){
                    let list = body.match(/href="dict_down.php\?id=[^"]*"/g);
                    // console.log(list)
                    if(!list) return;
                    for(let i = 0; i < list.length; i++){
                        let id = list[i].match(/id=(.*[^"])*"/)[1];
                        // console.log(id);
                        // if(utils.diffDoneConf("./dict_conf/down_inner", id).length > 0){
                        //     findhref(id);
                        //     utils.flagDoneConf("./dict_conf/down_inner", id)
                        // }
                        utils.flagDoneConf("./dict_conf/page_ok", url);

                        // if(utils.diffDoneConf("./dict_conf/down_inner", id).length > 0){
                        //     findhref(id);
                        //     utils.flagDoneConf("./dict_conf/down_inner", id)
                        // }
                        utils.noRepeat("./dict_conf/down_inner", id, findhref);

                    }
                }
            }else{
                console.log("无法请求page-------,并重试", url);
                // retryTask(f);
            }

        });
    };
    // f();
    utils.noRepeat("./dict_conf/page_ok", url, f);
};


let downFile = (url, c) =>{

    let fileName = url.match(/[^\/]*\.ld2/g);

    let f = () =>{
        // let j = request.jar();
        // let cookie = request.cookie('ul=en; PHPSESSID=a4ojnbpqecleiis7vglpi3nrc4; bwm_uid=qeT1mYca/ddwqf2vg4JK0Q==');
        // j.setCookie(cookie, url);
        let doneConf = "./dict_done.conf";
        if(utils.diffDoneConf(doneConf, [url]).length === 0) return;//已下载过
        request({url:url, headers:header}).on("response", (response) =>{
            console.log(response.statusCode); // 200
            console.log(response.headers); // 'image/png'
            if(response.statusCode == 503){
                console.log("监测到网站报错,添加记录");
                utils.flagDoneConf("./message.log", [c + "_" + url]);
            }else if(response.statusCode == 200){
                console.log("成功下载");
                utils.flagDoneConf(doneConf, [url]);
            }
            taskNext();
        }).pipe(fs.createWriteStream(`./dict/${c}_${fileName}`)).on("finish", () =>{
            console.log("file down_ done!===", `./dict/${c}_${fileName}`);
            fs.copyFile(`./dict/${c}_${fileName}`, `./dict_done/${c}_${fileName}`, (err) =>{
                if(err) throw err;
                console.log(`./dict/${c}_${fileName}`, " was copied to done folder");
            });
        }).on("error", () =>{
            console.log("file createWriteStream error");
            pushTask(f);
        });
    };
    pushTask(f);
};


let findhref = (dictId) =>{
    let url = `http://www.lingoes.cn/zh/dictionary/dict_down.php?id=${dictId}`;
    utils.flagDoneConf("./dict_conf/down_inner", dictId);
    return;
    let f = () =>{
        request({url:url, headers:header}, (error, response, body) =>{
            console.log("download page ===========statusCode:", response && response.statusCode);
            // console.log('body:', body);
            if(response && response.statusCode === 200){
                if(body){
                    let list = body.match(/www\.lingoes\.cn\/download\/dict\/[^.]*\.ld2/g);
                    let title = body.match(/<div title="ID: .*><b>(.*)<\/b><\/div>/) || "未名_";
                    if(list){
                        downFile("http://" + list[0], title[1]);
                    }else{
                        console.log("download list no in page ! try agina======", url);
                        // retryTask(f);
                    }
                }
            }else{
                console.log("downloadpage- fail------ i retry ", (url));
                // retryTask(f);
            }
            taskNext();
        });
    };
    pushTask(f);
};

// findlist(30);
// findhref('0686B4A12450F84F9506FE31F3207E7')
// downFile("http://www.lingoes.cn/download/dict/ld2/International%20Standard%20Chinese%20characters%20Dictionary.ld2", "国际标准汉字大字典");

for(let i = 1; i <= 30; i++){
    // findlist(i);
}

//找到url
let findDownloadUrl = () =>{
    let f = (reqUrl) =>{
        request({url:reqUrl, headers:header}, (error, response, body) =>{
            console.log("download page ===========statusCode:", response && response.statusCode);
            // console.log('body:', body);
            if(response && response.statusCode === 200){
                if(body){
                    let list = body.match(/www\.lingoes\.cn\/download\/dict\/[^.]*\.ld2/g);
                    let title = body.match(/<div title="ID: .*><b>(.*)<\/b><\/div>/) || "未名_";
                    if(list){
                        // downFile("http://" + list[0], title[1]);
                        utils.flagDoneConf("./dict_conf/file_conf", reqUrl);
                        utils.flagDoneConf("./dict_conf/file_url", "http://" + list[0] + "_" + title[1]);
                        utils.flagDoneConf("./dict_conf/file_dl", "http://" + list[0]);
                    }else{
                        console.log("download list no in page ! try agina======", reqUrl);
                        // retryTask(f);
                    }
                }
            }else{
                console.log("downloadpage- fail code ", response.statusCode, (reqUrl));
            }
        });
    };

    let ids = fs.readFileSync("./dict_conf/down_inner");
    let list = (JSON.parse(ids));
    //let url = `http://www.lingoes.cn/zh/dictionary/dict_down.php?id=${dictId}`;

    for(let i = 0; i < list.length; i++){
        // setTimeout(()=>{
        let dictId = list[i];
        let url = `http://www.lingoes.cn/zh/dictionary/dict_down.php?id=${dictId}`;
        utils.noRepeat("./dict_conf/file_conf", url, () =>{
            f(url);
        });
        // }, i*200);

    }


};

// findDownloadUrl()


let downloadFilePromise = () =>{
    let fileName = url.match(/[^\/]*\.ld2/g);
    let f = () =>{
        // let j = request.jar();
        // let cookie = request.cookie('ul=en; PHPSESSID=a4ojnbpqecleiis7vglpi3nrc4; bwm_uid=qeT1mYca/ddwqf2vg4JK0Q==');
        // j.setCookie(cookie, url);
        let doneConf = "./dict_done.conf";
        if(utils.diffDoneConf(doneConf, [url]).length === 0) return;//已下载过
        request({url:url, headers:header}).on("response", (response) =>{
            console.log(response.statusCode); // 200
            console.log(response.headers); // 'image/png'
            if(response.statusCode == 503){
                console.log("监测到网站报错,添加记录");
                utils.flagDoneConf("./message.log", [c + "_" + url]);
            }else if(response.statusCode == 200){
                console.log("成功下载");
                utils.flagDoneConf(doneConf, [url]);
            }
            taskNext();
        }).pipe(fs.createWriteStream(`./dict/${c}_${fileName}`)).on("finish", () =>{
            console.log("file down_ done!===", `./dict/${c}_${fileName}`);
            fs.copyFile(`./dict/${c}_${fileName}`, `./dict_done/${c}_${fileName}`, (err) =>{
                if(err) throw err;
                console.log(`./dict/${c}_${fileName}`, " was copied to done folder");
            });
        }).on("error", () =>{
            console.log("file createWriteStream error");
        });
    };
};

let gainFiles = () =>{
    let url_conf = fs.readFileSync("./dict_conf/file_url");
    let list = (JSON.parse(url_conf));

    console.log("data, length", list.length);

    recursiveFiles(list, 0);
};

let recursiveFiles = (list, i) =>{
    gainFilePromise(list[i]).then((result) =>{
        i++;
        if(list[i]){
            recursiveFiles(list, i);
        }
    }).catch(e =>{
        console.log("download error", e);
    });
};

let gainFilePromise = (url_conf) =>{
    let url = url_conf.split("_")[0];
    let c = url_conf.split("_")[1];
    let fileName = url.match(/[^\/]*\.ld2/g);
    let doneConf = "./dict_conf/gain_file";
    return new Promise((resolve, reject) =>{
        utils.noRepeat(doneConf, url, (id) =>{
            if(!id){
                resolve(0);
                return;
            }
            request({url:url, headers:header}).on("response", (response) =>{
                console.log(response.statusCode); // 200
                console.log(response.headers); // 'image/png'
                if(response.statusCode == 503){
                    console.log("监测到网站报错", url);
                }else if(response.statusCode == 200){
                    console.log("成功下载访问下载地址", url_conf);
                }
            }).pipe(fs.createWriteStream(`./dict/${c}_${fileName}`)).on("finish", () =>{
                console.log("file down_ done!===", `./dict/${c}_${fileName}`);
                fs.copyFile(`./dict/${c}_${fileName}`, `./dict_done/${c}_${fileName}`, (err) =>{
                    if(err) throw err;
                    utils.flagDoneConf(doneConf, [url]);
                    resolve(1);
                    console.log(`./dict/${c}_${fileName}`, " was copied to done folder");
                });
            }).on("error", () =>{
                console.log("file createWriteStream error---");
                resolve(0);
            });
        });
    });
};

gainFiles();