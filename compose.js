let config=require('./config');
let big_width_count = config.width_count;
let big_height_count = config.height_count;
let big_width_count_index = 0;
let big_height_count_index = 0;
let globule = require('globule');
let path = require('path');
let dest = globule.find(path.join(__dirname, 'destTemp/**.png'));
let images = require("images");
let destImage = images(dest[0]);
let resultImg = images(destImage.width(), destImage.height());
let resource_width = destImage.width() / big_width_count;
let resource_height = destImage.height() / big_height_count;
let resource_count = Math.floor(destImage.width() * destImage.height() / big_width_count / big_height_count);
let resource_path = globule.find(path.join(__dirname, 'resourceTemp/**'));
let interval = 100 / resource_count;
let fs_extra = require('fs-extra');
let maxNum = resource_path.length-1;
let minNum = 0;

for(let i=0;i<resource_path.length;i++)
    if(path.extname(resource_path[i])!='.png'&&path.extname(resource_path[i])!='.jpg')
        resource_path.splice(i,1);
console.log('開始合併圖片');
for (let i = 0; i < resource_count; i++) {
    console.log("合併圖片進度:  " + i * interval + '\t%');
    let resource_index = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    let img = images(resource_path[resource_index]);
    resultImg.draw(img, big_width_count_index * resource_width, big_height_count_index * resource_height);
    big_width_count_index++;
    if (big_width_count_index >= big_width_count) {
        big_width_count_index = 0;
        big_height_count_index++;
        if (big_height_count_index >= big_height_count) {
            big_height_count_index = 0;
        }
    }
}
resultImg.draw(destImage, 0, 0);
resultImg.save(path.join(__dirname, 'result', 'compose.png'), {
        quality: 50
    });
fs_extra.removeSync('resourceTemp');
fs_extra.removeSync('destTemp');
console.log('合併圖片進度:  100\t%');
