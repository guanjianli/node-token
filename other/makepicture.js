var request = require('request');
const cheerio = require('cheerio');
const fs = require("fs");

var save = function (cb) {
    request('http://www.sex.com/pics/asian/?sort=latest', function (error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        if (body) {
            const $ = cheerio.load(body);
            var imgs = $('#container img').slice(0, 50);
            console.log('imgs:', imgs.length);
            var list = [];
            imgs.map(function (i, el) {
                var tx = $(this).attr('data-src');
                tx = tx.replace("https://images.sex.com", "https://www.liguanjian.com/av").replace("\/300\/", "\/620\/");
                tx && list.push(tx);
            });
            console.log(list);

            fs.open('./public/girl.json', 'w', (err, fd) => {
                if (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    throw err;
                }

                fs.writeFile('./public/girl.json', JSON.stringify(list), (err) => {
                    if (err) throw err;
                    cb && cb();
                    console.log('The file has been saved!');
                });
            });
        }
    });
};


//express 部分
var router = require("express").Router();
router.get("/girl", function (req, res) {
    //res.writeHead(200);
    save(function () {
        res.end('All girls is update');
    });
});
router.get("/av/*", function (req, res) {
    //res.writeHead(200);
    console.log(req.url);
    var r = req.url.replace(/av\//, "");
    if (req.method === 'GET' || req.method === 'HEAD') {
        request.get("https://images.sex.com" + r).pipe(res)
    }
});
module.exports = router;