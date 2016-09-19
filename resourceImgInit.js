"use strict"; //使用strict mode(嚴格模式)
let globule = require('globule');
let path = require('path');
let images = require("images");
let config=require('./config');
let big_width_count = config.width_count;
let big_height_count = config.height_count;
let resource = globule.find(path.join(__dirname, 'resource/**'));
let destPath = globule.find(path.join(__dirname, 'dest/**'));
for (let i = 0; i < destPath.length; i++)
    if (path.extname(destPath[i]) != '.png' && path.extname(destPath[i]) != '.jpg')
        destPath.splice(i, 1);
let destImage = images(destPath[0]);
let interval = Math.round(100 / resource.length);
let fs_extra = require('fs-extra');
let resource_width = destImage.width() / big_width_count;
let resource_height = destImage.height() / big_height_count;

let fs = require('fs');
let readimage = require("readimage");
let filedata = fs.readFileSync(destPath[0]);
let PNGImage = require('pngjs-image');

console.log('準備更新圖片');
fs_extra.removeSync('resourceTemp');
fs_extra.mkdirsSync('resourceTemp');
console.log('準備完成');
console.log('你的圖片共有' + resource.length-1 + '張');
console.log('開始更新圖片');

for (let i = 0; i < resource.length; i++) {
    if (i < resource.length - 1)
        console.log("更新圖片進度:  " + i * interval + '\t%');
    if (path.extname(resource[i]) == '.jpg' || path.extname(resource[i]) == '.png')
        images(resource[i])
        .resize(resource_width, resource_height)
        .save(path.join(__dirname, 'resourceTemp', path.basename(resource[i])), {
            quality: 50
        });
}
fs_extra.removeSync('destTemp');
fs_extra.mkdirsSync('destTemp');
readimage(filedata, function(err, image) {
    if (err) {
        console.log(err)
    }
    let destImg = images(destPath[0]);
    let destImgWidth = destImg.width();
    let destImgHeight = destImg.height();
    let rgbaObjs = [];
    for (let i = 0; i < image.frames[0].data.length; i += 4) {
        let pixelIndex = Math.floor(i / 4);
        let x = Math.floor(pixelIndex % destImgWidth);
        let y = Math.floor(pixelIndex / destImgWidth);
        rgbaObjs.push(getRGBAObj(x, y, image.frames[0].data[i], image.frames[0].data[i + 1], image.frames[0].data[i + 2], image.frames[0].data[i + 3]));
    }
    let destTemp = PNGImage.createImage(destImage.width(), destImage.height());
    for (let i = 0; i < rgbaObjs.length; i++) {
        destTemp.setAt(rgbaObjs[i].x, rgbaObjs[i].y, { red: rgbaObjs[i].r, green: rgbaObjs[i].g, blue: rgbaObjs[i].b, alpha: 255 * 0.7 });
    }
    destTemp.writeImage(path.join(__dirname, 'destTemp/')+ path.basename(destPath[0], path.extname(destPath[0]))+'.png', function(err) {
        if (err) throw err;
    });
});

console.log('更新圖片進度:  100\t%');
console.log('更新圖片完成');


function getRGBAObj(x, y, r, g, b, a) {
    let obj = {
        'x': x,
        'y': y,
        'r': r,
        'g': g,
        'b': b,
        'a': a
    };
    return obj;
}
