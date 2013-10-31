/**
 * 将DataUrl图片保存成实际文件
 */
var crypto = require('crypto'),
    fs = require('fs'),
    generateNo = function() {
        return crypto.randomBytes(4).readUInt32LE(0);
    }

module.exports = function(content, dir, preDir) {
    content = content.replace(/src="(.*?)"/g, function(one, two) {
        // 普通地址不处理
        if (!/^data:/.test(two)) return one;
        var regex = /^data:.+\/(.+);base64,(.*)$/;
        var matches = two.match(regex);
        var ext = matches[1];
        var data = matches[2];
        two = two.replace(/^data:image\/png;base64,/, "");
        var name = generateNo();
        var filename = dir + name + '.' + ext;
        // 检查是否文件同名
        while (fs.existsSync(filename)) {
            name = generateNo();
            filename = dir + name + '.' + ext;
        }
        fs.writeFileSync(filename, two, 'base64');
        return 'src="' + preDir + name + '.' + ext + '"';
    });
    return content;
};