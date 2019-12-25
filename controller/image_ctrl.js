var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var images = require('images');
//保存头像图片的接口
exports.save_avatar = async function (file) {
    var result = await savefile(file, "avatar");
    if(result == undefined){
        return path.join({url:'./images/7bd6353c9a04fdbe889ad945f20d48ee.jpeg'});
    }
    else {
        return result;
    }
}
//保存身份证图片的接口
exports.save_identity_ID_image = async function (file) {
    var result = await savefile(file, "identity_ID");
    if(result == undefined){
        return path.join({url:'./images/7bd6353c9a04fdbe889ad945f20d48ee.jpeg'});
    }
    else {
        return result;
    }
}
//保存医师资格证图片的接口
exports.save_doctor_cert_image = async function (file) {
    var result = await savefile(file, "doctor_cert");
    if(result == undefined){
        return path.join({url:'./images/7bd6353c9a04fdbe889ad945f20d48ee.jpeg'});
    }
    else {
        return result;
    }
}
//保存诊疗记录的接口
exports.save_treat_record_image = async function (file) {
    var result = new Array()
    if (file[0] == undefined) {
        var tmp = await savefile(file, "treat_record");
        if(tmp != undefined){
            return {url:tmp};
        }
        else{
            return undefined;
        }
    } else {
        var a = 0
        for(var x in file){
            var tmp = await savefile(file[x], "treat_record");
            if(tmp != undefined){
                result[a] = {url:tmp};
                a += 1;
            }
        }
        return result;
    }
}
/*
* savefile(posterData) 保存文件，如果是图片会进行压缩，返回promise，内容为文件路径
* posterData post的文件，enctype="multipart/form-data"，postData为req.files.uploadPoster
* promise获取方法
* image_ctrl(req.files.file).then(newFilepath => {
*       console.log(newFilepath)
*   })
* */
function savefile(posterData, typepath) {
    var promise = new Promise(function (resolve, reject) {
        var originalFilename = posterData.originalFilename;
        var filePath = posterData.path;
        if(originalFilename){
            fs.readFile(filePath, function (err, data) {
                if(err){
                    console.log(err.message);
                    return;
                }
                var type = posterData.type.split('/')[1];
                if(type == 'msword')
                    type = 'doc';
                else if(type == 'vnd.openxmlformats-officedocument.wordprocessingml.document')
                    type = 'docx';
                else if(type == 'vnd.ms-excel')
                    type = 'xls';
                else if(type == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                    type = 'xlsx';
                else if(type == 'vnd.ms-powerpoint')
                    type = 'ppt';
                else if(type == 'vnd.openxmlformats-officedocument.presentationml.presentation')
                    type = 'pptx';
                var timestamp = Date.now();
                var fsHash = crypto.createHash('md5');
                fsHash.update(data);
                var md5 = fsHash.digest('hex');
                var Hash = crypto.createHash('md5');
                var poster = Hash.update(md5 + timestamp).digest('hex') + '.' + type;
                if(type == 'jpeg' || type == 'png') {
                    var newFilepath = path.join('./images/' + typepath + '/' + poster);
                    saveimage(type, data, resolve, newFilepath);
                }
                else{
                    var newFilepath = path.join('./document/' + poster);
                    fs.writeFile(newFilepath, data, function (err) {
                        if(newFilepath){
                            resolve(newFilepath);
                        }
                        if(err) {
                            console.log(err);
                        }
                    })
                }
            })
        }
        else{
            resolve(undefined);
        }
    })
    promise.then(function (value) {
        return value;
    })
    return promise;
}
/*保存图片并压缩*/
function saveimage(type, data, resolve, newFilepath) {
    fs.writeFile(newFilepath, data, function (err) {
        if(newFilepath){
            images(newFilepath).save(newFilepath, {quality : 50});
            resolve(newFilepath);
        }
        if(err) {
            console.log(err);
        }
    })
}
/*读取图像，设置图像宽高，如果height未指定，则根据当前宽高等比缩放，如果width,height均未指定，则不做操作，返回promise，内容为文件路径*/
exports.readfile = function readfile(imagepath, width, height){
    var promise = new Promise(function (resolve, reject) {
        if (imagepath) {
            var type = imagepath.split('.')[imagepath.split('.').length - 1];
            if((type == 'jpeg' || type == 'png' || type == 'jpg') && width != undefined) {
                var timestamp = Date.now();
                var Hash = crypto.createHash('md5');
                var poster = Hash.update(imagepath + timestamp).digest('hex') + '.' + type;
                var newFilepath = path.join('./tmp/' + poster);
                if (height != undefined) {
                    images(imagepath).size(width, height).save(newFilepath);
                } else {
                    images(imagepath).size(width).save(newFilepath);
                }
                resolve(newFilepath);
            }
            else{
                resolve(imagepath);
            }
        }
    })
    promise.then(function (value) {
        return value;
    })
    return promise;
}
