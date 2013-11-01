var mongoose = require('mongoose');
// 讨论模型
var Discussion = mongoose.model('Discussion', {
    type: String, // 类型
    typeId: String, // 相关id,如讨论id,需求id
    author: String,
    date: {
        type: Date,
        default: Date.now
    },
    content: String
});

exports.Model = Discussion;