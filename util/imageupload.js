/**
 * Created by liguanjian on 2017-5-27.
 */

var formidable = require("formidable");
var fs = require("fs");
var cacheFolder = '/root/ser/public/upload/';
exports.upload = function(req, res, cb) {
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = cacheFolder; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;
    var displayUrl;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        var extName = ''; //后缀名
        console.log(JSON.stringify(files))
        switch (files.fileUp.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length === 0) {
            res.send({
                code: -1,
                detail: '只支持png和jpg格式图片'
            });
            return;
        } else {
            var avatarName =  (Math.random() * 5000>>0)+ "_" + Date.now()  + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            displayUrl = "https://www.liguanjian.com/upload/" + avatarName;
            fs.renameSync(files.fileUp.path, newPath); //重命名
            cb(displayUrl);
        }
    });
};

exports.anyFileUpload = function(req, res, cb) {
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = '/root/ser/public/update/'; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        //path.match(/[^\/]*\..+/g)[0]
        fs.renameSync(files.fileUp.path, form.uploadDir + files.fileUp.name); //重命名
        cb("https://www.liguanjian.com/update/" + files.fileUp.name);
    });
};