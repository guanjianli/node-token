var request = require('request');
const fs = require("fs");


// 动态 http://web.sanguosha.com/220/assets/sgspad/generalSkin/skinAnim/2407.flv
var save = function (picIndex, cb) {
    request
        .get('http://web.sanguosha.com/220/assets/sgspad/generalSkin/bigView/' + picIndex + '.png')
        .on('error', function (err) {
            console.log(err)
        })
        .pipe(fs.createWriteStream('./sgs2/' + picIndex + '.png'))
};

fs.readdir("./head", function (error, files) {

    for (let i in files) {
        let n = files[i].match(/\d+/g)[0];
        for (let j = 0; j < 10; j++) {
            save(n + '0' + j)
        }
    }
})

/*for(let i =1 ; i< 300;i++){
 for(let j=0;j<10;j++){
 save(i+'0'+j)
 }
 }*/
