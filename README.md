# node-token

# 注册
	```
	  'https://www.liguanjian.com/ser/register?name=li&password=lix'
	```
	返回:{"code":0,"detail":"注册成功!"}
	
# 登录
	```
	  'https://www.liguanjian.com/ser/login?name=li&password=li'
	```
	要求参数 name password
	返回:{"code":0,"detail":"登录成功!","token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGciLCJwdyI6ImxpeCIsImlhdCI6MTQ5NTEwNTgzMiwiZXhwIjoxNDk1MTA5NDMyfQ.n5WCeSY361NMZrl1lFGzDl0biqRrS0WgfjMiYw3ihQBJG_p0u0fUxVGHnmTdwqLYg3R-Dc8QdxM8bnKjXlMKoGcP7yyaubfeywrvyvFjtXma59EWhTGf0B_JL14o5BMtzoM84JOYIJcNArWRUTpFUf_lqaQVh_uUc-swNi-LXR3UF1qCSVQuz5aYDiHF12xABI-gt0cF9Y4Ohoij9AoOJqliR-e_nGhTg1bWvvz1GLdCh6zu1_lE1H1TEG0h45z2qu2sZbr-tSfSIB3FuCbJzNlfRi-euLdhymqVysqly9qq_Kwb0TfRD_3LIZeGffOELXAjHfD4Cc5gmlG9j0yDhA"}

# 修改密码
	```
	  'https://www.liguanjian.com/ser/change?password=lixseex&token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGciLCJwdyI6ImxpeCIsImlhdCI6MTQ5NTEwNTgzMiwiZXhwIjoxNDk1MTA5NDMyfQ.n5WCeSY361NMZrl1lFGzDl0biqRrS0WgfjMiYw3ihQBJG_p0u0fUxVGHnmTdwqLYg3R-Dc8QdxM8bnKjXlMKoGcP7yyaubfeywrvyvFjtXma59EWhTGf0B_JL14o5BMtzoM84JOYIJcNArWRUTpFUf_lqaQVh_uUc-swNi-LXR3UF1qCSVQuz5aYDiHF12xABI-gt0cF9Y4Ohoij9AoOJqliR-e_nGhTg1bWvvz1GLdCh6zu1_lE1H1TEG0h45z2qu2sZbr-tSfSIB3FuCbJzNlfRi-euLdhymqVysqly9qq_Kwb0TfRD_3LIZeGffOELXAjHfD4Cc5gmlG9j0yDhA'
	```
	要求参数 token password
	返回:{"code":0,"detail":"修改密码成功!"}

# 读取笔记
	```
	  'https://www.liguanjian.com/ser/note?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGciLCJwdyI6ImxpeCIsImlhdCI6MTQ5NTEwNTgzMiwiZXhwIjoxNDk1MTA5NDMyfQ.n5WCeSY361NMZrl1lFGzDl0biqRrS0WgfjMiYw3ihQBJG_p0u0fUxVGHnmTdwqLYg3R-Dc8QdxM8bnKjXlMKoGcP7yyaubfeywrvyvFjtXma59EWhTGf0B_JL14o5BMtzoM84JOYIJcNArWRUTpFUf_lqaQVh_uUc-swNi-LXR3UF1qCSVQuz5aYDiHF12xABI-gt0cF9Y4Ohoij9AoOJqliR-e_nGhTg1bWvvz1GLdCh6zu1_lE1H1TEG0h45z2qu2sZbr-tSfSIB3FuCbJzNlfRi-euLdhymqVysqly9qq_Kwb0TfRD_3LIZeGffOELXAjHfD4Cc5gmlG9j0yDhA'
	```
	要求参数 token note(内容)
	返回:{"code":0,"data":[{"name":"lg","note":"dsfsf","status":1}]}

# 插入笔记
	```
	  'https://www.liguanjian.com/ser/addnote?note=dsfsf&token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGciLCJwdyI6ImxpeCIsImlhdCI6MTQ5NTEwNTgzMiwiZXhwIjoxNDk1MTA5NDMyfQ.n5WCeSY361NMZrl1lFGzDl0biqRrS0WgfjMiYw3ihQBJG_p0u0fUxVGHnmTdwqLYg3R-Dc8QdxM8bnKjXlMKoGcP7yyaubfeywrvyvFjtXma59EWhTGf0B_JL14o5BMtzoM84JOYIJcNArWRUTpFUf_lqaQVh_uUc-swNi-LXR3UF1qCSVQuz5aYDiHF12xABI-gt0cF9Y4Ohoij9AoOJqliR-e_nGhTg1bWvvz1GLdCh6zu1_lE1H1TEG0h45z2qu2sZbr-tSfSIB3FuCbJzNlfRi-euLdhymqVysqly9qq_Kwb0TfRD_3LIZeGffOELXAjHfD4Cc5gmlG9j0yDhA'
	```
	要求参数 token note(内容)
	返回:{"code":0,"detail":"插入笔记成功!"}
	

	
