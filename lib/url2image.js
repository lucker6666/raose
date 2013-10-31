/**
 * 将DataUrl图片保存成实际文件
 */
var crypto = require('crypto'),
    fs = require('fs');

module.exports = function(content, dir) {
    content = content.replace(/src="(.*?)"/g, function(one, two) {
        if (!/^data:/.test(two)) return one;
        var regex = /^data:.+\/(.+);base64,(.*)$/;
        var matches = two.match(regex);
        var ext = matches[1];
        var data = matches[2];
        two = two.replace(/^data:image\/png;base64,/, "");
        var name = dir + crypto.randomBytes(4).readUInt32LE(0) + '.' + ext;
        fs.writeFileSync(name, two, 'base64');
        return 'src="' + name + '"';
    });
    return content;
};