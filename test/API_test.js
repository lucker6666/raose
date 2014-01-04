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

describe('User',function(){

    it('Login::wrong password',function(done){
        request.post('/api/user/signin')
        .expect('Content-Type',/json/)
        .end(function(err,res){
            console.log(err);
            done();
        });
        
    });

});