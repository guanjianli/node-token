const net = require('net');
const request = require('request');
var flag;
var client;
var useMap = {};
var words = [
	"欢迎来到震感体验中心。震感体验-请按1。 智商充值-请按2。 人工服务-请拨打18200740514。",
	"你按了什么？我好像没有收到，请再按一次，谢谢大家支持。",
	"请认真地输入一次好吗? 我都要被你气到机器爆炸了。",
	"麻烦你按一下2,好吗？",
	"好烦的，遇到你这种客人，再见。",
	"你怎么还不走，再不走我报警了！！",
	"我选择自杀。",
	"不想和你说话。!!"
]

var doit = function(){    
    client = net.createConnection({ port: 8282,host:'www.bigiot.net' }, () => {
        //'connect' listener
        console.log('connected to server!');
        client.write('{"M":"checkin","ID":"2596","K":"0f64eb9e3"}\n',()=>{
          flag = setInterval(()=>{
             client.write('{"M":"update","ID":"2596","V":{"2462":"'+(Math.random()*100>>0)/100+'"}}\n');
          }, 5000)
        })
    });
    client.on('data', (data) => {
        console.log(data.toString());
        //client.end();
		var obj = JSON.parse(data);
		if(obj.M == "say"){
            try{
                var id = obj.ID;
                if(useMap[id] >= 0){
                    useMap[id] += 1;
                }else{
                    useMap[id] = 0;
                }
                //var w = words[useMap[id]] ?  words[useMap[id]] : words[words.length-1];
                var l = 'http://www.tuling123.com/openapi/api?key=437879c8fefd4f8b8cb400e220696912&info='+encodeURI(decodeURIComponent(obj.C));
                console.log(l);
                request(l, "utf8" ,function (error, response, body) {
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    if(body){
                        try{
                            var r = JSON.parse(body);
                            r && sayWords(id, r.text + (r.url ? r.url : ""));
                        }catch(e){
                            console.log(e);
                        }

                    }
                })
            }catch(e){
                console.log(e);
            }
		}
    });
    client.on('end', () => {
        console.log('disconnected from server');
        clearInterval(flag);
        setTimeout(()=>{
            client = doit();
        }, 5000);    
    });
    client.on('error',(e)=>{
        console.log(e);
    })
}
var sayWords = function(id, word){
	console.log("i will say " + word);
	client.write('{"M":"say","ID":"' + id + '","C":"' + word + '","SIGN":"候风地动仪萌萌哒~ ^.^"}\n', (data)=>{
		console.log("say end " + id + data)
		data && console.log("words end by "+ word + " : " + data.toString());
	})
}
doit();