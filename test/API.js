var mongoose = require('mongoose');
var request = require('supertest');
var should = require('should');
var assert = require('assert');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/raose');
var server = require('../server');

server.start();

request = request('http://localhost:8004');

describe('GET /issues', function() {

    it('GET::respond with 403', function(done) {
        request.get('/api/issues')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.body.error.should.equal(403);
                done();
            });
    });

});

describe('User', function() {

    it('Login::missing username', function(done) {
        request.post('/api/user/signin')
            .send({})
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                res.body.msg.should.equal('username not specified');
                done();
            });

    });

    it('Login::missing password', function(done) {
        request.post('/api/user/signin')
            .send({
                username: 'airyland',
                password: ''
            })
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                res.body.msg.should.equal('password not specified');
                done();
            });
    });

    it('Login::success', function(done) {
        request.post('/api/user/signin')
            .send({
                username: 'airyland',
                password: '2472252'
            })
            .expect('Content-Type', /json/)
            .expect('Set-cookie',/connect\.sid/)
            .end(function(err, res) {
                res.body.data.username.should.equal('airyland');
                done();
            });
    });

    it('Login::fail', function(done) {
        request.post('/api/user/signin')
            .send({
                username: 'airyland',
                password: '247225'
            })
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                res.body.msg.should.equal('wrong username or password');
                done();
            });

    });

});