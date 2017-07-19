/**
 * Created by liguanjian on 2017-6-19.
 */
var spawn = require('child_process').spawn;
var server = null;

/**
* node runpertime.js 3000 t.js
* 表示执行 t.js ，每3秒 一次
*/
function startServer(){
    console.log('start ext');
	if(server){console.log("still exec . wait!"); return; }
    server = spawn('node', process.argv.slice(3));
    console.log('node js pid is '+server.pid);
    server.on('close',function(code,signal){
        console.log("close,by:"+JSON.stringify(arguments));
		server.kill(signal);
		server = null;
        //server.kill(signal);
        //server = startServer();
    });
    server.on('error',function(code,signal){
        console.log("error,by:"+arguments);
        server.kill(signal);
		server = null;
        //server = startServer();
    });
    return server;
}

setInterval(startServer, process.argv[2]);
