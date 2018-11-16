let request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const child_process = require("child_process");

let dictid = [];
let url = "http://gameui.matme.info/blog/";
let requestQueue = [];
let findlist = (pageId) => {
    let url = `http://www.lingoes.cn/zh/dictionary/dict_update.php?page=${pageId}&order=1`;
    let f = () => {
        request(url, (error, response, body) => {
            //console.log('error:', error); // Print the error if one occurred
            console.log("page=======statusCode:", response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.
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
                'Cookie': 'ul=en; PHPSESSID=a4ojnbpqecleiis7vglpi3nrc4; bwm_uid=qeT1mYca/ddwqf2vg4JK0Q=='
            }
        }).on('response', (response) => {
            console.log(response.statusCode) // 200
            console.log(response.headers) // 'image/png'
        }).pipe(fs.createWriteStream(`./dict/${c}_${fileName}`))
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
                    let title = body.match(/<div title="ID: .*><b>(.*)<\/b><\/div>/);
                    downFile("http://" + list[0], title[1]);
                }
            } else {
                console.log("url fail------", (url))
            }

        });
    };
    requestQueue.push(f);
};

// findlist(30);
// findhref('0686B4A12450F84F9506FE31F3207E7')
downFile("http://www.lingoes.cn/download/dict/ld2/International%20Standard%20Chinese%20characters%20Dictionary.ld2", "国际标准汉字大字典");

for (let i = 1; i <= 30; i++) {
    findlist(i);
}

let loopDo = () => {
    let task = requestQueue.pop();
    task();
    setTimeout(() => {
        if (requestQueue.length > 1) {
            loopDo();
        }
    }, Math.random() *1000 + 5000)
};

loopDo();