/**
 * Created by liguanjian on 2017-6-19.
 */
var spawn = require('child_process').spawn;
var server = null;

/**
* node runpertime.js 3000 node t.js
* 表示执行 t.js ，每3秒 一次
*/
function startServer(){
    console.log('start ext');
	if(server){console.log("still exec . wait!"); return; }
    server = spawn(process.argv[3], process.argv.slice(4));
    console.log('node js pid is '+server.pid);
	server.stdout.on("data", function(data){console.log("data:"+data);})
    server.on('close',function(code,signal){
        console.log("close,by:"+JSON.stringify(arguments));
		signal && server.kill(signal);
		server = null;
    });
    server.on('error',function(code,signal){
        console.log("error,by:"+arguments);
        signal && server.kill(signal);
		server = null;

    });
    return server;
}

setInterval(startServer, process.argv[2]);
