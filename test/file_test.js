'use strict';
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/raose');
var File = require('../controllers/file.js');
var User = require('../controllers/User.js');
var UserModel = require('../models/user');

exports['file'] = {
    setUp: function(done) {
        // setup here
        done();
    },
    'file:name validate::at least 3 words': function(test) {
        File.add({
            name: 'ab'
        }, function(err, data) {
            test.equal(err, 'name shoud has at least 3 characters', 'should be error.');
            test.done();
        });
    }
};

exports['file:passed'] = {
    // remove username:'abc'
    setUp: function(done) {
        UserModel.findOne({
            username: 'abc'
        }).remove(function(err) {
            if (err) throw err;
            done();
        });
    },
    'file:name validate::passed': function(test) {
        File.add({
            name: 'abc'
        }, function(err, data) {
            test.equal(err, null, 'should be null.');
            test.equal(data.name, 'abc', 'name saved should be equal');
            test.done();
        });
    }
};

exports['user:create'] = {
    setUp: function(done) {
        new UserModel({
            username: 'raose',
            password: 'w2od1fd274d17frld',
            email: 'hhahhahahah@qq.com'
        }).save(function(err, item) {
            done();
        });
    },
    'user:Create:success': function(test) {
        User.addUser({
            username: 'raoseee',
            password: 'sdfsdfsdfdsf',
            email: 'abcd@qq.com'
        }, function(err, data) {
            test.equal(data.username, 'raoseee', 'should be abcd');
            test.equal(data.email, 'abcd@qq.com', 'email should be equal');
            test.done();
        });

    },
    'user:Create:unique username': function(test) {
        User.addUser({
            username: 'raose',
            password: 'w2od1fd274d17frld',
            email: 'air2y1lddf2dffddfand@qq.com'
        }, function(err, data) {
            test.equal(err.code, 11000, 'error code should be 11000');
            test.equal(/users.\$username/.test(err.err), true, 'field shoud be $username')
            test.done();
        });

    },
    'user:Create:unique email': function(test) {
        User.addUser({
            username: 'raoseeeeee',
            password: 'w2od1fd274d17frld',
            email: 'hhahhahahah@qq.com'
        }, function(err, data) {
            test.equal(err.code, 11000, 'error code should be 11000');
            test.equal(/users.\$email/.test(err.err), true, 'field shoud be $email')
            test.done();
        });
    },
    tearDown: function(done) {
        UserModel.findOne({
            username: /raose/
        }).remove(function(err) {
            done();
        });
    }
};

exports['user:check'] = {
    setUp: function(done) {
        new UserModel({
            username: 'test001',
            password: 'w2od1fd274d17frld',
            email: 'test001@qq.com'
        }).save(function(err, item) {
            done();
        });
    },
    'check by username:exited': function(test) {
        User.checkUser('test001', function(existed) {
            test.equal(existed, true, 'should has existed');
            test.done();
        });
    },
    'check by username:not existed': function(test) {
        User.checkUser('test002', function(existed) {
            test.equal(existed, false, 'should has existed');
            test.done();
        });
    },
    'check by email:existed': function(test) {
        User.checkUser('test001@qq.com', function(existed) {
            test.equal(existed, true, 'should has existed');
            test.done();
        });
    },
    'check by email:not existed': function(test) {
        User.checkUser('test002@qq.com', function(existed) {
            test.equal(existed, false, 'should has existed');
            test.done();
        });
    },
    tearDown: function(done) {
        UserModel.findOne({
            username: /test/
        }).remove(function(err) {
            done();
        });
    }
};