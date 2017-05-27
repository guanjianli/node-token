# node-token

# 注册
    'https://www.liguanjian.com/ser/register?name=li&password=lix'

	返回:{"code":0,"detail":"注册成功!"}
	
# 登录
    'https://www.liguanjian.com/ser/login?name=li&password=li'
	要求参数 name password
	返回:{"code":0,"detail":"登录成功!","avatar":"https://www.liguanjian.com/upload/2615_1495872414712.jpg","token":"G9j0yDhA","refreshtoken":"RcNLdjBA"}

# 刷新Token
    'https://www.liguanjian.com/ser/refresh?refreshtoken=5VpIw3MSkg'
    登录时（见上），会返回refreshtoken,只能通过refreshtoken来刷新，请谨慎保存，有必要时加密
    返回 id, token, refreshtoken
    0 成功
    -4 refreshtoken不能用token代替
    -1 refreshToken已失效(修改密码，服务器重启等因素影响)
    -5 token已过期,refresh过期
    -6 token已过期(refresh未过期)

# 验证Token
    'https://www.liguanjian.com/ser/heartbeat?token=eyJhbGciOi'
    检验token的合法性
    返回 code 为 0 正常

# 修改密码
	'https://www.liguanjian.com/ser/change?password=lixseex&name=li&oldpassword=li'
	要求参数 name oldpassword password
	返回:{"code":0,"detail":"修改密码成功!"}

# 修改头像
    'https://www.liguanjian.com/avatar?token=eyJhbGciO'
    请求方式不同，是post。request payload夹带图片。
    返回 {"code":0,"avatar":"https://www.liguanjian.com/upload/4380_1495872194532.jpg"}

# 读取笔记
	'https://www.liguanjian.com/ser/note?token=5gmlG9j0yDhA'
	要求参数 token note(内容)
	返回:{"code":0,"data":[{"id":1,"name":"lg","note":"dsfsf","status":1}]}

# 插入笔记
	'https://www.liguanjian.com/ser/addnote?note=lG9j0yDhA'
	要求参数 token note(内容)
	返回:{"code":0,"detail":"插入笔记成功!"}
	

	
