var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var url2img = require('../lib/url2image.js');
var issueScheme = mongoose.Schema({
    // 是否开启
    open: {
        type: Boolean,
        default: true
    },
    // 关闭信息
    close: {
        // 关闭时间 
        date: Date,
        // 操作者
        operator: String
    },
    // the creator
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // userAgent
    userAgent: String,
    // 用户
    author: String,
    // 标题
    title: {
        type: String,
        require: true
    },
    // 指派给
    owner: String,
    // 影响范围
    site: String,
    // URL 
    url: String,
    content: String,
    // 来源
    from: String,
    // 影响范围
    area: String,
    // 时间
    date: {
        type: Date,
        default: Date.now
    },
    // 标签
    labels: String,
    // 优先级
    level: Number,
    // 属于feature
    feature: {
        type: Schema.Types.ObjectId,
        ref: 'Feature'
    }
});

// save DataURI image
issueScheme.pre('save', function(next) {
    this.content = url2img(this.content, './public/uploads/', './uploads/');
    next();
});

var Issues = mongoose.model('Issue', issueScheme);
module.exports = Issues;