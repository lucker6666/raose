'use strict';
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/raose');
var file = require('../controllers/file.js');

exports['file'] = {
    setUp: function(done) {
        // setup here
        done();
    },
    'file:name validate::at least 3 words': function(test) {
        file.add({
            name: 'ab'
        }, function(err, data) {
            test.equal(err, 'name shoud has at least 3 characters', 'should be error.');
            test.done();
        });
    },
    'file:name validate::passed': function(test) {
        file.add({
            name: 'abc'
        }, function(err, data) {
            test.equal(err, null, 'should be null.');
            test.equal(data.name, 'abc', 'name saved should be equal');
            test.done();
        });
    }
};