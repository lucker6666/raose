var json = require('./helper.js').json;

var mongoose = require('mongoose');
var User = mongoose.model('User', {
    // 用户名
    username: String,
    // 密码，暂时为明码
    password: String,
    // 权限标识
    flag: {
        type: Number,
        default: 0
    },
    // 真实姓名
    realname: String,
    // 邮箱
    email: String
});

exports.user = {
    // 获取用户列表
    list: function(req, res) {
        User.find({}, '-password', function(err, data) {
            json(res, err, data);
        });
    },
    // 获取单用户信息
    get: function(req, res) {
        User.findById(req.params.id, '-password', function(err, data) {
            json(res, err, data);
        });
    }
};