/**
 * Created by liguanjian on 2017-6-19.
 */
var spawn = require('child_process').spawn,
    server = null;

function startServer(){
    console.log('start ext');
    server = spawn('node',['ext.js']);
    console.log('node js pid is '+server.pid);
    server.stdout.on("data", function (data) {
        console.log(data);
    });
    server.on('close',function(code,signal){
        console.log("close,by:"+JSON.stringify(arguments));
        signal && server.kill(signal);
        server = startServer();
    });
    server.on('error',function(code,signal){
        console.log("error,by:"+arguments);
        signal && server.kill(signal);
        server = startServer();
    });
    return server;
}

startServer();