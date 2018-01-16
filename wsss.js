'use strict';

let https = require('https');
let fs = require('fs');
let WebSocket = require('ws');

let options = {
    key: fs.readFileSync('./liguanjian.key'),
    cert: fs.readFileSync('./liguanjian.pem')
};
let server = https.createServer(options).listen(1443);

let wss = new WebSocket.Server({ server });

wss.on('connection', function connection (ws) {
  ws.on('message', function message (msg) {
    console.log(msg);
  });
  ws.on('close', function close() {
    console.log('close this ws');	
  });
  ws.on('error', function error(e) {
    console.log('error:', e);
  });
  
  var itv = setInterval(function(){
    var result = (Math.random() * 100 >> 0);
	if(ws.readyState === WebSocket.OPEN){
		ws.send('heart beat . ' + result);
	}else{
		clearInterval(itv)
	}
  }, 1000)
});
