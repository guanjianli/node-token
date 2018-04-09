var request = require('request');
const cheerio = require('cheerio');
const fs = require("fs");

var url = 'http://gameui.matme.info/blog/';
var save = function () {
    request(url, function (error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        if (body) {
            const $ = cheerio.load(body);
            var imgs = $('img')//.slice(0, 50);
            console.log('imgs:', imgs.length);
            var list = [];
            imgs.map(function (i, el) {
                var tx = $(this).attr('src');
                tx = tx.replace(/-[\d]+x[\d]+/, "");
                var fileName = tx.match(/.*\/([^\/]+)$/)[1];
                request
                    .get(tx)
                    .on('error', function (err) {
                        console.log(err)
                    })
                    .pipe(fs.createWriteStream("./dl/"+fileName))
            });
            console.log(list);
        }
    });
};

save();
