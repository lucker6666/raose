var mongoose = require('mongoose');
var MessageModel = require('./message.js').MessageModel;
var Message = require('./message.js').Model;
var url2img = require('../lib/url2image.js');
// issue 
var Issues = mongoose.model('Issue', {
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
    // 用户
    author: String,
    // 标题
    title: String,
    // 指派给
    owner: String,
    // 影响范围
    site: String,
    // URL 
    url: String,
    content: String,
    // 来源
    from: String,
    // 提交人
    submit: String,
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
        id: String,
        title: String
    }
});
exports.Model = Issues;
exports.issues = {
    messages: function(req, res) {
        Message.find({
                typeInfo: {
                    type: 'issue',
                    id: req.params.id
                }
            },
            function(err, data) {
                res.send({
                    error: 0,
                    data: data
                });
            }
        );
    },
    add: function(req, res) {
        req.body.author = req.user.username;
        req.body.content = url2img(req.body.content, './public/uploads/', './uploads/');
        console.log(req.body.content);
        var issue = new Issues(req.body);
        issue.save(function(err, rs) {
            if (err) {
                res.send({
                    erro: -1,
                    msg: err
                });
                return;
            }
            // send message
            MessageModel.add({
                from: req.user.username,
                to: req.body.owner,
                typeInfo: {
                    type: 'issue',
                    id: rs._id
                },
                content: {
                    action: '指交了Issue',
                    target: req.body.title,
                    link: '/issue/' + rs._id
                }
            }, function(err, item) {
                res.send({
                    error: 0,
                    msg: '添加成功',
                    data: rs
                });
            });

        });
    },

    delete: function(req, res) {
        var id = req.params.id;
        Issues.findByIdAndRemove(id, function(err) {
            if (err === null) {
                res.send({
                    error: 0,
                    msg: '删除成功'
                });
            } else {
                res.send(error.innerError);
            }
        });
    },
    update: function(req, res) {
        var id = req.body._id;
        delete req.body._id;
        req.body.content = url2img(req.body.content, './public/uploads/', './uploads/');
        var isCloseAction = req.body.action === 'closeIssue',
            isReopenAction = req.body.action === 'reopenIssue',
            message = '更新了Issue';

        // 若为更新状态
        if (isCloseAction) {
            req.body.close = {
                operator: req.user.username,
                date: new Date()
            }
            req.body.open = false;
            message = '关闭了Issue';
        }

        // 若为重新开启
        if (isReopenAction) {
            req.body.open = true;
            message = '重新开启了Issue';
        };

        Issues.findByIdAndUpdate(req.params.id, req.body, function(err, item) {
            if (err === null) {
                MessageModel.add({
                    from: req.user.username,
                    to: 'all',
                    typeInfo: {
                        type: 'issue',
                        id: req.params.id
                    },
                    content: {
                        action: message,
                        target: item.title,
                        link: '/issue/' + item._id
                    }
                }, function(err, m) {
                    res.send({
                        error: 0,
                        data: item,
                        m: m,
                        msg: '更新成功'
                    });
                });
            } else {
                res.send({
                    error: -1,
                    msg: err
                })
            }
        })
    },

    list: function(req, res) {
        Issues.find({}, '-content', {
                sort: {
                    date: -1
                }
            },
            function(err, data) {
                if (err) throw err;
                res.send({
                    error: 0,
                    data: data
                })
            })
    },

    get: function(req, res) {
        Issues.findById(req.params.id, function(err, data) {
            if (err) throw err;
            res.send({
                error: 0,
                data: data
            });
        })
    }
};