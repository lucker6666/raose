var mongoose = require('mongoose');
// issue
exports.issues = require('./issue.js').issues;
// feature
exports.feature = require('./feature.js').feature;
// message
exports.message = require('./message.js').message;
// todo
exports.todo = require('./todo.js').todo;
// data
exports.data = require('./data.js').data;
// user
exports.user = require('./user.js').user;
// topic 
exports.topic = require('./topic.js').topic;
// doc
exports.docs = require('./doc.js').docs;
// discussion
exports.discussion = require('./discussion').discussion;
// me
exports.me = require('./me.js').me;
// status
exports.status = require('./status').status;
// file
exports.file = require('./file');
// taxonomy
exports.taxonomy = require('./taxonomy');
// log
exports.log = require('./log');
// follow 
exports.follow = require('./follow');
// tracker
exports.tracker = require('./tracker');
// datastore
exports.datas = require('./datas');
// datapool
exports.datapool = require('./datapool');
// calendar
exports.calendar = require('./calendar');

var error = {
    innerError: {
        error: -1,
        msg: '内部错误'
    }
};

// 用户模型
var ActiveUser = mongoose.model('activeUser', {
    // 邮箱
    email: String,
    // 激活信息
    activeInfo: {
        // 发送邮件时间
        sendTime: {
            type: Date,
            default: Date.now
        },
        // 激活时间
        activeTime: {
            type: Date,
            default: Date.now
        },
        // 是否已经激活
        hasActived: {
            type: Boolean,
            default: false
        },
        activeHash: String
    }
});

var generateHash = function (string) {
    return require('crypto').createHash('md5').update(string).digest("hex");
};

exports.account = {
    // 激活
    doActive: function (req, res) {
        var activeHash = req.query.hash;
        ActiveUser
            .where('activeInfo.hasActived')
            .equals(false)
            .where('activeInfo.activeHash')
            .equals(activeHash)
            .exec(function (err, data) {
                console.log(arguments);
                if (err) {
                    res.send({
                        erro: -2,
                        msg: '查找出错了'
                    });
                    return;
                }
                // 存在
                if (data.length) {
                    // 未激活
                    // 更新状态为激活

                    // 更新激活时间
                    ActiveUser.update({
                        _id: data[0]._id
                    }, {
                        activeInfo: {
                            sendTime: data[0].activeInfo.sendTime,
                            hasActived: true,
                            activeTime: new Date()
                        }
                    }, function (err) {
                        if (err) {
                            res.send({
                                error: 4,
                                msg: '抱歉，激活失败鸟' + err
                            });
                            return;
                        } else {
                            res.send({
                                error: 0,
                                msg: '激活成功鸟'
                            });
                        }
                    });

                } else {
                    res.send({
                        error: 5,
                        msg: '亲，激活链接无效哦'
                    });
                }
            });
    }
};
exports.mail = {
    sendmail: function (req, res) {
        var email = req.body.email;
        if (!/@bozhong.com/.test(email)) {
            res.send({
                error: 1,
                msg: '抱歉，不是播种网邮箱'
            });
            return;
        }

        ActiveUser.find({
            email: email
        }, function (err, data) {
            if (data.length) {
                console.log(data);
                res.send({
                    error: 2,
                    msg: '已经发送过邮箱激活邮件啦'
                });
            } else {
                // 没有发送过
                var nodemailer = require('nodemailer');
                // 生成激活hash
                var activeHash = generateHash(email);
                var user = new ActiveUser({
                    email: email,
                    activeInfo: {
                        activeHash: activeHash
                    }
                });

                // Create a SMTP transport object
                var transport = nodemailer.createTransport("SMTP", {
                    auth: {
                        user: "airyland@qq.com",
                        pass: "qqlizhengnjxt"
                    }
                });

                // Message object
                var message = {
                    // sender info
                    from: '播种网产品工具 <airyland@qq.com>',
                    // Comma separated list of recipients
                    to: '"Receiver Name" <' + email + '>',
                    // Subject of the message
                    subject: 'Nodemailer is unicode friendly ✔', //
                    headers: {
                        'X-Laziness-level': 1000
                    },
                    // plaintext body
                    text: 'Hello to myself!',
                    // HTML body
                    html: '激活链接：<a href="http://172.16.5.108:8004/api/account/doActive?hash=' + activeHash + '">点此激活</a>'
                };
                transport.sendMail(message, function (error) {
                    if (error) {
                        console.log('Error occured');
                        console.log(error.message);
                        res.send({
                            error: 1,
                            msg: '发送错误'
                        });
                        return;
                    }
                    user.save(function (err) {
                        res.send({
                            error: 0,
                            msg: '激活邮件发送成功'
                        });
                    });
                    // if you don't want to use this transport object anymore, uncomment following line
                    transport.close(); // close the connection pool
                });

            }
        });

    }
};