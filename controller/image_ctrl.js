var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var images = require('images')
/*savefile(posterData) 保存文件，如果是图片会进行压缩，返回promise，内容为文件路径
* posterData post的文件，enctype="multipart/form-data"，postData为req.files.uploadPoster
* promise获取方法
* image_ctrl(req.files.file).then(newFilepath => {
        console.log(newFilepath)
    })
*需要在该文件同级目录下创建document，images和tmp三个文件夹
 */
exports.savefile = function savefile(posterData) {
    var promise = new Promise(function (resolve, reject) {
        var filePath = posterData.path
        if(filePath){
            fs.readFile(filePath, function (err, data) {
                var type = posterData.type.split('/')[1]
                if(type == 'msword')
                    type = 'doc'
                else if(type == 'vnd.openxmlformats-officedocument.wordprocessingml.document')
                    type = 'docx'
                else if(type == 'vnd.ms-excel')
                    type = 'xls'
                else if(type == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                    type = 'xlsx'
                else if(type == 'vnd.ms-powerpoint')
                    type = 'ppt'
                else if(type == 'vnd.openxmlformats-officedocument.presentationml.presentation')
                    type = 'pptx'
                var timestamp = Date.now()
                var fsHash = crypto.createHash('md5')
                fsHash.update(data)
                var md5 = fsHash.digest('hex')
                var Hash = crypto.createHash('md5')
                var poster = Hash.update(md5 + timestamp).digest('hex') + '.' + type
                if(type == 'jpeg' || type == 'png') {
                    var newFilepath = path.join(__dirname, '/images/' + poster)
                    saveimage(type, data, resolve, newFilepath)
                }
                else{
                    var newFilepath = path.join(__dirname, '/document/' + poster)
                    fs.writeFile(newFilepath, data, function (err) {
                        if(newFilepath){
                            resolve(newFilepath)
                        }
                        if(err) {
                            console.log(err)
                        }
                    })
                }
            })
        }
    })
    promise.then(function (value) {
        return value
    })
    return promise
}
/*保存图片并压缩*/
function saveimage(type, data, resolve, newFilepath) {
    fs.writeFile(newFilepath, data, function (err) {
        if(newFilepath){
            images(newFilepath).save(newFilepath, {quality : 50})
            resolve(newFilepath)
        }
        if(err) {
            console.log(err)
        }
    })
}
/*读取图像，设置图像宽高，如果height未指定，则根据当前宽高等比缩放，如果width,height均未指定，则不做操作，返回promise，内容为文件路径*/
exports.readfile = function readfile(imagepath, width, height){
    var promise = new Promise(function (resolve, reject) {
        if (imagepath) {
            var type = imagepath.split('.')[imagepath.split('.').length - 1]
            if((type == 'jpeg' || type == 'png' || type == 'jpg') && width != undefined) {
                var timestamp = Date.now()
                var Hash = crypto.createHash('md5')
                var poster = Hash.update(imagepath + timestamp).digest('hex') + '.' + type
                var newFilepath = path.join(__dirname, '/tmp/' + poster)
                if (height != undefined) {
                    images(imagepath).size(width, height).save(newFilepath)
                } else {
                    images(imagepath).size(width).save(newFilepath)
                }
                resolve(newFilepath)
            }
            else{
                resolve(imagepath)
            }
        }
    })
    promise.then(function (value) {
        return value
    })
    return promise
}