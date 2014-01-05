var json = require('./helper.js').json;
var mongoose = require('mongoose');
var User = require('../models/user.js');
var UserCtrl = require('../controllers/user.js');
var passport = require('passport');

var uuid = require('../lib/uuid.js');
var jwt = require('jwt-simple');
// add user
var addUser = function(data, callback) {
    // generate secret
    var secret = uuid.create();
    // generate token
    var payload = {
        username: data.username
    };
    var token = jwt.encode(payload, uuid);
    data.secret = secret;
    data.token = token;

    var user = new User(data);
    user.save(function(err, item) {
        callback && callback(err, item);
    });
    //@todo email notify option
};

exports.Model = User;
exports.user = {
    loginUser: function(req, res, next) {
        // return;
        UserCtrl.findUser(req.body.username, req.body.password, function(err, user) {
            if (!req.body.username) {
                res.send({
                    error: 1001,
                    msg: 'username not specified'
                });
                return;
            }

            if (!req.body.password) {
                res.send({
                    error: 1001,
                    msg: 'password not specified'
                });
                return;
            }

            if (user) {
                req.login(user, function(err) {
                    if (err) {
                        res.send({
                            error: 1002,
                            msg: 'login fail'
                        });
                    }
                    res.send({
                        error: 0,
                        data: user
                    });
                });

            } else {
                res.send({
                    error: 1002,
                    msg: 'wrong username or password'
                });
            }

        });
    },
    // add a user
    add: function(req, res) {
        var data = req.body;
        addUser(data, function(err, item) {
            res.send({
                error: err ? 1 : 0,
                data: item
            });
        });
    },
    // 获取用户列表
    list: function(req, res) {
        User.find({}, '-password', function(err, data) {
            json(res, err, data);
        });
    },
    // 获取单用户信息
    get: function(req, res) {
        // 如果带id
        if (req.params.id) {
            User.findById(req.params.id, '-password', function(err, data) {
                json(res, err, data);
            });
        } else {
            var username = req.user.username;
            User.find({
                username: username
            }, '-password', function(err, data) {
                json(res, err, data);
            });
        }

    }
};