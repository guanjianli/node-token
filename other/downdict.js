let request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const child_process = require("child_process");

let dictid = [];
let url = "http://gameui.matme.info/blog/";
let requestQueue = [];
let loopSta = 1;
let findlist = (pageId) => {
    let url = `http://www.lingoes.cn/zh/dictionary/dict_update.php?page=${pageId}&order=1`;
    let f = () => {
        request(url, (error, response, body) => {
            //console.log('error:', error); // Print the error if one occurred
            console.log("page=======statusCode:", response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.
            if (response && response.statusCode == 200){
                if (body) {
                    let list = body.match(/href="dict_down.php\?id=[^"]*"/g);
                    // console.log(list)
                    if (!list) return;
                    for (let i = 0; i < list.length; i++) {
                        let id = list[i].match(/id=(.*[^"])*"/)[1];
                        // console.log(id);
                        findhref(id);
                    }
                }
            }else {
                console.log("无法请求page-------,并重试",url);
                // retryTask(f);
            }

        });
    };
    requestQueue.push(f)

};


let downFile = (url, c) => {

    let fileName = url.match(/[^\/]*\.ld2/g);

    let f = () => {
        // let j = request.jar();
        // let cookie = request.cookie('ul=en; PHPSESSID=a4ojnbpqecleiis7vglpi3nrc4; bwm_uid=qeT1mYca/ddwqf2vg4JK0Q==');
        // j.setCookie(cookie, url);
        request({
            url: url, headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
                'Referer': 'http://www.lingoes.cn',
                'Cache-Control': 'no-cache',
                'Cookie': 'bwm_uid=zuUKmYcaYdNwqf2vg4Ka0Q==; ul=en; PHPSESSID=1kmgbirqb9dvble4ep4vp2j8p5'
            }
        }).on('response', (response) => {
            console.log(response.statusCode) // 200
            console.log(response.headers) // 'image/png'
            if (response.statusCode == 503){
                console.log("监测到网站报错,把task重新放进列表")
                writeErrorFile(c+"_"+url);
            }
        }).pipe(fs.createWriteStream(`./dict/${c}_${fileName}`)).on('finish', ()=>{
            console.log("file down_ done!===", `./dict/${c}_${fileName}`);
            fs.copyFile(`./dict/${c}_${fileName}`, `./dict_done/${c}_${fileName}`, (err) => {
                if (err) throw err;
                console.log(`./dict/${c}_${fileName}`,' was copied to destination.txt');
            });
        }).on('error', ()=>{
            console.log("file createWriteStream error");
            retryTask(f);
        })
    }
    requestQueue.push(f);
};


let findhref = (dictId) => {
    let url = `http://www.lingoes.cn/zh/dictionary/dict_down.php?id=${dictId}`;
    let f = () => {
        request(url, (error, response, body) => {
            console.log("download page ===========statusCode:", response && response.statusCode);
            // console.log('body:', body);
            if (response.statusCode === 200) {
                if (body) {
                    let list = body.match(/www\.lingoes\.cn\/download\/dict\/[^.]*\.ld2/g);
                    let title = body.match(/<div title="ID: .*><b>(.*)<\/b><\/div>/) || "未名_";
                    if(list){
                        downFile("http://" + list[0], title[1]);
                    }else {
                        console.log("download list no in page ! try agina======", url);
                        // retryTask(f);
                    }
                }
            } else {
                console.log("downloadpage- fail------ i retry ", (url))
                // retryTask(f);
            }

        });
    };
    requestQueue.push(f);
};

// findlist(30);
// findhref('0686B4A12450F84F9506FE31F3207E7')
// downFile("http://www.lingoes.cn/download/dict/ld2/International%20Standard%20Chinese%20characters%20Dictionary.ld2", "国际标准汉字大字典");

for (let i = 1; i <= 30; i++) {
    findlist(i);
}


let loopDo = () => {
    let task = requestQueue.pop();
    task();
    setTimeout(() => {
        if (requestQueue.length > 1) {
            loopDo();
            loopSta = 1;
        }else {
            loopSta = 0;
        }
    }, Math.random() *600)
};

loopDo();

loopDoRestart = ()=>{
    if (!loopSta && requestQueue.length > 1) {
        loopDo();
    }
};
let retryTask = (f)=>{
    requestQueue.push(f);
    loopDoRestart();//重启列表
};
let writeErrorFile = (error)=>{
    try {
        fs.appendFileSync('message.log', error+'\n');
        console.log('The path of no readyFile was appended to message.log!');
    } catch (err) {
        console.log('writeErrorFile', err);
    }
}