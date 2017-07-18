var request = require('request');
/**
*这个ADSESSION是QQ的登录时间。
*http://vip.qq.com/my/index.html?ADUIN=418197255&ADSESSION=1499825598&ADTAG=CLIENT.QQ.5527_.0&ADPUBNO=26630
*
*升级之后，好像版本号都有变化
*/
var loginUrl = "https://ssl.ptlogin2.qq.com/my_vip_center?pt_clientver=5533&pt_src=1&keyindex=9&clientuin=418197255&clientkey=00015968451800681123C177C495A7A343BD89986D60F9B4CC34F59654839B157B2217AB45AABDD7B683D90FE0D431E81A08D4FFC81DA6B529275B80A7C37644C59CA7A41DAE5C1520621B115C0B0251BE97FDCE40702C47EA316AD2BC841D72B4954E97E2FDDED43453EA4FC4F4DA3A&ADUIN=418197255&ADSESSION=1499998793&ADTAG=CLIENT.QQ.5533_.0&ADPUBNO=26719";

var checkInUrl = "http://iyouxi.vip.qq.com/ams3.0.php?_c=page&actid=16&g_tk=39119132a89ceedaab108ef5a0f75f14&callback=?";

var options = {
  url: '',
  headers: {
    'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
	'Cookie':'RK=Sd3OxmtKQG; o_cookie=418197255; pt2gguin=o0418197255; uin=o0418197255; skey=@Ct0SjfzJQ; ptisp=cnc; ptcz=d4fbe6e8bcbb3c6f28a981bee76060bd11ea8cf499df97e98ca2c3a583862bbb; pgv_info=ssid=s8184825670; pgv_pvid=9339154170'

  }
};
 
function LoginCallback(error, response, body) {
  if (!error && response.statusCode == 200) {
	  console.log(response.statusCode);
	  //console.log(body)
	  var name = body.match(/健力.{0,1}/g);
	  if(name){
		  console.log("登录<" + name[0] + ">成功");
		  console.log("开始签到");
		  options.url = checkInUrl;
		  request(options, CheckInCallback);
	  }
  }
}

function CheckInCallback(error, response, body) {
  if (!error && response.statusCode == 200) {
	  console.log("签到结果",JSON.parse(body).msg);
	  //console.log(body);
  }
}

options.url = loginUrl;
request(options, LoginCallback);