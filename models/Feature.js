var mongoose = require('../lib/mongoose');
var FeatureSchema = mongoose.Schema({
    // 作者
    author: String,
    // 日期
    date: {
        type: Date,
        default: Date.now
    },
    // 标题
    title: String,
    // 内容
    content: String,
    // 成员
    members: Array,
    // 文件列表
    files: Array,
    // is archive
    archived: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('feature', FeatureSchema);
