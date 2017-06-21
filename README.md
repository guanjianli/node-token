# node-token

# 注册
    'https://www.liguanjian.com/ser/register?name=li&password=lix'
	返回:
	{"code":0,"detail":"注册成功!"}
	{code: -5, detail: '用户已被注册'}
	
# 登录
    'https://www.liguanjian.com/ser/login?name=li&password=li'
	要求参数 name password
	返回:
	{"code":0,"detail":"登录成功!","avatar":"https://www.liguanjian.com/upload/2615_1495872414712.jpg","token":"G9j0yDhA","refreshtoken":"RcNLdjBA"}
	{code: -3, detail: '密码错误'}
    {code: -4, detail: '用户不存在'}

# 登出
    'https://www.liguanjian.com/ser/logout?token=G9j0yDhA'
    要求参数 token
    返回：
    {"code": 0, "detail": '登出成功'}
    {code: -30, detail: '没有对应的token,可能是已退出登录,或者修改了密码'}

# 刷新Token
    'https://www.liguanjian.com/ser/refresh?refreshtoken=5VpIw3MSkg'
    登录时（见上），会返回refreshtoken,只能通过refreshtoken来刷新，请谨慎保存，有必要时加密
    返回 id, token, refreshtoken
    0 成功
    {"code":0,"token":"G9j0yDhA","refreshtoken":"RcNLdjBA","id":"???"}
    {code: -27, detail: 'refreshToken过期'}
    {code: -28, detail: '非法refreshToken'}
    {code: -29, detail: '非法使用token, 请使用refreshtoken刷新'}

# 验证Token
    'https://www.liguanjian.com/ser/heartbeat?token=eyJhbGciOi'
    检验token的合法性
    {code: 0, data: 1}
    {code: -21, detail: 'token&refreshToken过期，请重新登录'}
    {code: -22, detail: '验证错误-非法refreshToken'}
    {code: -23, detail: 'token已过期(refresh未过期)'}
    {code: -24, detail: 'refreshToken解析错误'}
    {code: -25, detail: '验证错误-非法token'}
    {code: -26, detail: 'refreshtoken不能代替token使用'}
    {code: -31, detail: 'token没有对应的refreshtoken,可能是已退出登录,或者修改了密码'}
    {code: -32, detail: '没有对应的refreshtoken,可能是已退出登录,或者修改了密码'}

# 修改密码
	'https://www.liguanjian.com/ser/change?password=lixseex&name=li&oldpassword=li'
	要求参数 name oldpassword password
	返回:{"code":0,"detail":"修改密码成功!"}
	{code: -3, detail: '密码错误'}
    {code: -6, detail: '修改失败，检查用户名与密码'}

# 修改头像
    'https://www.liguanjian.com/avatar?token=eyJhbGciO'
    请求方式不同，是post。request payload夹带图片。
    返回 {"code":0,"avatar":"https://www.liguanjian.com/upload/4380_1495872194532.jpg"}

# 用户信息
    'https://www.liguanjian.com/ser/myinfo?token=eyJhbGc'
    param : token
    返回 {"code":0,"avatar":"https://www.liguanjian.com/upload/3851_1495873268561.jpg","registertime":"2017-05-18 15:45:11"}

# 读取笔记
	'https://www.liguanjian.com/ser/note?token=5gmlG9j0yDhA'
	要求参数 token note(内容)
	返回:{"code":0,"data":[{"id":1,"name":"lg","note":"dsfsf","status":1}]}

# 插入笔记
	'https://www.liguanjian.com/ser/addnote?note=lG9j0yDhA'
	要求参数 token note(内容)
	返回:{"code":0,"detail":"插入笔记成功!"}

# 删除笔记
    'https://www.liguanjian.com/ser/deletenote?token=eyJhbG&ids=97'
    要求参数 ids
    批量删除 ids=95,96,97
    返回:{"code":0,"detail":"删除笔记成功!"}
	
# 设置完成状态
    'https://www.liguanjian.com/ser/notestatus?status=3&id=100&token=eyJhbGci'
    参数 status id
    返回 {"code":0,"detail":"设置笔记状态成功!"}

# 修改笔记内容
    'https://www.liguanjian.com/ser/notecontent?content=hell&id=100&token=eyJhbGci'
    参数 content id
    返回 {"code":0,"detail":"设置笔记内容成功!"}

# 所有错误码

##### 通用错误码
    {code: -1, err: err}
    {code: -2, detail: '参数缺失'}

##### 有关所有登录可能的错误码
    {code: -3, detail: '密码错误'}
    {code: -4, detail: '用户不存在'}
    {code: -5, detail: '用户已被注册'}
    {code: -6, detail: '修改失败，检查用户名与密码'}

##### token 有关所有请求可能的错误码
    {code: -21, detail: 'token&refreshToken过期，请重新登录'}
    {code: -22, detail: '验证错误-非法refreshToken'}
    {code: -23, detail: 'token已过期(refresh未过期)'}
    {code: -24, detail: 'refreshToken解析错误'}
    {code: -25, detail: '验证错误-非法token'}
    {code: -26, detail: 'refreshtoken不能代替token使用'}
    {code: -27, detail: 'refreshToken过期'}
    {code: -28, detail: '非法refreshToken'}
    {code: -29, detail: '非法使用token, 请使用refreshtoken刷新'}
    {code: -30, detail: '没有对应的token,可能是已退出登录,或者修改了密码'}
    {code: -31, detail: 'token没有对应的refreshtoken,可能是已退出登录,或者修改了密码'}
    {code: -32, detail: '没有对应的refreshtoken,可能是已退出登录,或者修改了密码'}
