/**
 * Created by yuanyongjie on 2016/3/25.
 */
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var requrl = 'http://www.imooc.com/course/list';

request(requrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        /*console.log(body);*/
        acquireData(body);
    }
});


function acquireData(data) {
    var $ = cheerio.load(data);

    var meizi = $(".course-list-img img").toArray();
    console.log(meizi.length);
    var len = meizi.length;
    for (var i = 0; i < len; i++) {
        var imgsrc = meizi[i].attribs.src;
        var filename = parseUrlForFileName(imgsrc);
        downloadImg(imgsrc, filename, function () {
            console.log(filename + 'done');
        });
    }
}


function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}

var downloadImg = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        if (err) {
            console.log('err:' + err);
            return false;
        }
        console.log('res:' + res);
        request(uri).pipe(fs.createWriteStream('images/' + filename)).on('close', callback);
    })
}