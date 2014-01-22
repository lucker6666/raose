var request = require('supertest');
var should = require('should');
var assert = require('assert');
var server = require('../server');
var app = server.app;
var code = require('../lib/error_code');
var querystring = require('querystring');
var buildFilter = function (opt) {
    return encodeURIComponent(querystring.stringify(opt));
};

describe('Datastore', function () {
    var databaseConfig = require('../config/database.json');
    var serverHandler;
    before(function (done) {
        serverHandler = server.start(0, done);
    });
    after(function () {
        serverHandler.close();
    });

    it('GET:should error with missing bucket', function (done) {
        var filters = buildFilter({
            'end-date': 'aaa'
        });
        request(app).get('/api/datastore/export.json?filters=' + filters)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.body.error.should.equal(code['ARG_MISSED'][0]);
                res.body.msg.should.equal('missing arg:bucket');
                done();
            });
    });


    it('GET:should error with missing start-date', function (done) {
        var filters = buildFilter({
            'bucket': 'test',
            'end-date': 'aaa'
        });
        request(app).get('/api/datastore/export.json?filters=' + filters)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.body.error.should.equal(code['ARG_MISSED'][0]);
                res.body.msg.should.equal('missing arg:start-date');
                done();
            });
    });

    it('GET:should error with start-date wrong type', function (done) {
        var filters = buildFilter({
            'bucket': 'test',
            'start-date': 'aaa'
        });
        request(app).get('/api/datastore/export.json?filters=' + filters)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.body.error.should.equal(code['ARG_WRONG_TYPE'][0]);
                res.body.msg.should.equal('arg type not match:start-date');
                done();
            });
    });

    it('GET:should return empty array', function (done) {
        var filters = buildFilter({
            'bucket': 'test',
            'start-date': '2014-01-09',
            'end-date': '2014-01-15'
        });
        request(app).get('/api/datastore/export.json?filters=' + filters)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                console.log(res.body);
                res.body.error.should.equal(0);
                res.body.sum.should.equal(0);
                res.body.rows.length.should.equal(0);
                done();
            });
    });

    it('POST:should return bucket required error', function (done) {
        request(app).post('/api/datastore')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.body.msg.should.equal('missing arg:bucket');
                done();
            });
    });

    it('POST:should successfully insert', function (done) {
        request(app).post('/api/datastore')
            .send({
                bucket: 'test',
                date: '2014-01-21',
                data: 255
            })
            .expect('Content-Type', /json/)
            .expect(/successfully/, done)
    });


    it('GET:should return array with one item', function (done) {
        var filters = buildFilter({
            'bucket': 'test',
            'start-date': '2014-01-09',
            'end-date': '2014-01-22'
        });
        request(app).get('/api/datastore/export.json?filters=' + filters)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                console.log(res.body);
                res.body.error.should.equal(0);
                res.body.sum.should.equal(255);
                res.body.rows.length.should.equal(1);
                done();
            });
    });

});