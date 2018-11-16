let request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const child_process = require("child_process");

let dictid = [];
let url = "http://gameui.matme.info/blog/";
let findlist = function(pageId){
    let url = `http://www.lingoes.cn/zh/dictionary/dict_update.php?page=${pageId}&order=1`;
    request(url, function(error, response, body){
        //console.log('error:', error); // Print the error if one occurred
        console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        if(body){
            let list = body.match(/href="dict_down.php\?id=[^"]*"/g);
            // console.log(list)
            for(let i = 0; i < list.length; i++){
                let id = list[i].match(/id=(.*)[^"]/)[1];
                console.log(id);
                findhref(id);
            }
        }
    });
};

for(let i = 1; i <= 30; i++){

}
findlist(2);

let downFile = (c, e) =>{
    let bash = `curl --Referer 'http://www.lingoes.cn' --cookie 'Hm_lvt_69171c310610e1095af623409527429c=1542349105; ul=en; PHPSESSID=nssv66eqtt5d2muh87tkn25993; bwm_uid=gelcmcsbPJ3bqP2vPYIz1Q==; Hm_lpvt_69171c310610e1095af623409527429c=1542367834' --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36' http://www.lingoes.cn/download/dict/ld2/International%20Standard%20Chinese%20characters%20Dictionary.ld2 -o '${c}_${e}'`;
    child_process.exec(bash, (err, data) =>{
        console.log(err, data);
    });
};

let findhref = function(dictId){
    let url = `http://www.lingoes.cn/zh/dictionary/dict_down.php?id=${dictId}`;
    request(url, function(error, response, body){
        //console.log('error:', error); // Print the error if one occurred
        console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        if(body){
            let list = body.match(/www.lingoes.cn\/download\/dict.*[^ld2]ld2/);
            console.log("usl--------", list);
        }
    });
};