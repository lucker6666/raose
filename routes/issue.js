var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MessageModel = require('./message.js').MessageModel;
var Message = require('./message.js').Model;
var url2img = require('../lib/url2image.js');
var Discussion = require('./discussion.js').Model;
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
exports.Model = Issues;
exports.issues = {
    // issues summary
    summary: function (req, res) {
        var ep = require('eventproxy').create("allno", "open", "mysubmit", "mysubmitOpen", "blame2me", function ($1, $2, $3, $4, $5) {
            res.send({
                error: 0,
                data: {
                    all: $1,
                    allopen: $2,
                    mysubmit: $3,
                    mysubmitOpen: $4,
                    blame2me: $5
                }
            });
        });

        Issues.count({}, function (err, no) {
            ep.emit('allno', no);
        });

        Issues.count({open: true}, function (err, no) {
            ep.emit('open', no);
        });


        Issues.count({created_by: req.user.uid}, function (err, no) {
            ep.emit('mysubmit', no);
        });


        Issues.count({created_by: req.user.uid, open: true}, function (err, no) {
            ep.emit('mysubmitOpen', no);
        });

        Issues.count({owner: req.user.username}, function (err, no) {
            ep.emit('blame2me', no);
        });

    },
    // 获取单个issue的回复
    getDiscussions: function (req, res) {
        var issueId = req.params.id;
        Discussion.find({
            type: 'issue',
            typeId: issueId
        }, function (err, data) {
            if (err) throw err;
            res.send({
                error: 0,
                data: data
            });
        });
    },
    // 添加一个评论
    addDiscussion: function (req, res) {
        req.body.author = req.user.username;
        var discussion = new Discussion(req.body);
        discussion.save(function (err, item) {
            if (err) throw err;
            res.send({
                erro: 0,
                msg: '添加成功',
                data: item
            });
        });
    },
    messages: function (req, res) {
        Message.find({
                "typeInfo": {
                    "catId": req.params.id,
                    "cat": "issue"
                }
            },
            function (err, data) {
                res.send({
                    error: 0,
                    data: data
                });
            }
        );
    },
    add: function (req, res) {
        req.body.author = req.user.username;
        req.body.content = url2img(req.body.content, './public/uploads/', './uploads/');
        // 如果没有提交者，则为自己
        if (!req.body.submit) {
            req.body.submit = req.user.username;
        }
        // add creator info
        req.body.created_by = req.user.uid;

        var issue = new Issues(req.body);
        issue.save(function (err, rs) {
            if (err) {
                res.send({
                    erro: -1,
                    msg: err
                });
                return;
            }
            // send message
            MessageModel.add({
                typeInfo: {
                    cat: 'issue',
                    catId: '' + rs._id
                },
                from: req.user.username,
                to: req.body.owner,
                content: {
                    action: '指交了Issue',
                    target: req.body.title,
                    link: '/issue/' + rs._id
                }
            }, function (err, item) {
                res.send({
                    error: 0,
                    msg: '添加成功',
                    data: rs
                });
            });

        });
    },

    delete: function (req, res) {
        var id = req.params.id;
        Issues.findByIdAndRemove(id, function (err) {
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
    update: function (req, res) {
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
            };
            req.body.open = false;
            message = '关闭了Issue';
        }

        // 若为重新开启
        if (isReopenAction) {
            req.body.open = true;
            message = '重新开启了Issue';
        }


        Issues.findByIdAndUpdate(req.params.id, req.body, function (err, item) {
            if (err === null) {
                MessageModel.add({
                    typeInfo: {
                        cat: 'issue',
                        catId: '' + item._id
                    },
                    from: req.user.username,
                    to: 'all',
                    content: {
                        action: message,
                        target: item.title,
                        link: '/issue/' + item._id
                    }
                }, function (err, m) {
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

    list: function (req, res) {
        var filters = req.query.filters;
        if (filters) {
            var querystring = require('querystring');
            filters = querystring.parse(filters);
        } else {
            filters = {};
        }

        if (filters.open && filters.open === 'false') {
            filters.open = false;
        }

        if (filters.open && filters.open === 'true') {
            filters.open = true;
        }

        if (filters.created_by && filters.created_by === 'me') {
            filters.created_by = req.user.uid;
        }

        Issues.find(filters).select('-content').populate('created_by', '-password -email').sort('-date').exec(function (err, data) {
            if (err) throw err;
            res.send({
                error: 0,
                data: data
            });
        });
    },

    get: function (req, res) {
        Issues.findById(req.params.id, function (err, data) {
            if (err) throw err;
            res.send({
                error: 0,
                data: data
            });
        })
    }
};