var request = require('request');
/**
*这个ADSESSION是QQ的登录时间。
*http://vip.qq.com/my/index.html?ADUIN=418197255&ADSESSION=1499825598&ADTAG=CLIENT.QQ.5527_.0&ADPUBNO=26630
*
*升级之后，好像版本号都有变化
*/
var loginUrl = "http://vip.qq.com/my/index.html?ADUIN=418197255&ADSESSION=1499852865&ADTAG=CLIENT.QQ.5533_.0&ADPUBNO=26719";

var checkInUrl = "http://iyouxi.vip.qq.com/ams3.0.php?_c=page&actid=16&g_tk=39119132a89ceedaab108ef5a0f75f14&callback=?";

var options = {
  url: '',
  headers: {
    'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
	'Cookie':'pgv_pvi=4016151552; pgv_si=s8204072960; _qpsvr_localtk=0.5008748502275244; ptisp=ctc; RK=Id3OgEt6SG; ptcz=b8cc90a55e85cb4626f884e1226d4bff15d94dc313f17886ab7f1b08654a53b5; pt2gguin=o0418197255; uin=o0418197255; skey=@53elPfVbV; p_uin=o0418197255; p_skey=1tt75bxKBCrvE-2gIdvvltTWEXkU8XZpbDSYvefyBP0_; pt4_token=vtgD4i4Ci7bKS0AM99UQXnW8QohYx5PCc97aR4bpYYA_; pgv_info=ssid=s2793509514; ts_last=vip.qq.com/my/index.html; pgv_pvid=2440556870; ts_uid=7135646480; tphp_arr_nick=418197255%7CvaHBpoya'

  }
};
 
function LoginCallback(error, response, body) {
  if (!error && response.statusCode == 200) {
	  console.log(response.statusCode);
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