var json = require('./helper.js').json;
var User = require('../models/user.js');
var UserCtrl = require('../controllers/User.js');
var uuid = require('../lib/uuid.js');
var jwt = require('jwt-simple');
// add user
var addUser = function (data, callback) {
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
    user.save(function (err, item) {
        callback && callback(err, item);
    });
    //@todo email notify option
};

exports.Model = User;
exports.user = {
    // search user
    searchUser: function (req, res, next) {
        var name = req.query.name;
        User.searchUserByName(name, function (err, users) {
            if (err) {
                return next();
            }
            res.send({
                error: 0,
                data: users
            });
        });
    },
    checkUser: function (req, res) {
        UserCtrl.checkUser(req.body.username, function (existed) {
            res.send({
                error: 0,
                data: existed
            });
        });
    },
    // logout
    logoutUser: function (req, res) {
        req.logout();
        res.send({
            error: 0,
            msg: 'logout success'
        });
    },
    // login user
    loginUser: function (req, res, next) {
        UserCtrl.findUser(req.body.username, req.body.password, function (err, user) {
            if (!req.body.username) {
                return next('params should be complete');
            }

            if (!req.body.password) {
                return next('password not specified');
            }

            if (user) {
                req.login(user, function (err) {
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
    add: function (req, res) {
        var data = req.body;
        addUser(data, function (err, item) {
            res.send({
                error: err ? 1 : 0,
                data: item
            });
        });
    },
    // 获取用户列表
    list: function (req, res) {
        User.find({}, '-password', function (err, data) {
            json(res, err, data);
        });
    },
    // 获取单用户信息
    get: function (req, res) {
        // 如果带id
        if (req.params.id) {
            User.findById(req.params.id, '-password', function (err, data) {
                json(res, err, data);
            });
        } else {
            var username = req.user.username;
            User.find({
                username: username
            }, '-password', function (err, data) {
                json(res, err, data);
            });
        }

    }
};
