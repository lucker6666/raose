var mongoose = require('mongoose');
var MessageModel = require('./message.js').MessageModel;
// issue 
var Issues = mongoose.model('Issue', {
    // 是否开启
    open: {
        type: Boolean,
        default: true
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
    level: Number
});
exports.Model = Issues;
exports.issues = {
    add: function(req, res) {
        req.body.author = req.user.username;
        var issue = new Issues(req.body);
        issue.save(function(err, rs) {
            if (err) {
                res.send({
                    erro: -1,
                    msg: err
                });
                return;
            }
            MessageModel.add({
                from: req.user.username,
                to: req.body.owner,
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
                })
            } else {
                res.send(error.innerError);
            }
        });
    },
    update: function(req, res) {
        delete req.body._id;
        Issues.findByIdAndUpdate(req.params.id, req.body, function(err) {
            if (err === null) {
                res.send({
                    error: 0,
                    msg: '更新成功'
                })
            } else {
                res.send({
                    error: -1,
                    msg: err
                })
            }
        })
    },

    list: function(req, res) {
        Issues.find({}, null, {
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
    },
};