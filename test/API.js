var request = require('supertest');
var should = require('should');
var assert = require('assert');
var server = require('../server');
var app = server.app,
    request = request(app);

describe('User', function () {
    var databaseConfig = require('../config/database.json');
    var serverHandler;
    before(function (done) {
       //mongoose.disconnect();
      //  mongoose.createConnection('mongodb://localhost/' + databaseConfig.database);
      //server = app.listen(0,done);
      request.get('/api/test/setup').end(function(err,res){
        //console.log('setup results',res.body);
      });
      serverHandler = server.start(0,done);
    });
    after(function(){
      serverHandler.close();
    });

    it('Login::missing username', function (done) {
        request.post('/api/user/signin')
            .send({})
            .expect('Content-Type', /json/)
            .end(function (err, res) {
               // console.log(err,res);
                res.body.msg.should.equal('params should be complete');
                done();
            });

    });

    it('Login::missing password', function (done) {
        request.post('/api/user/signin')
            .send({
                username: 'airyland',
                password: ''
            })
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.body.msg.should.equal('password not specified');
                done();
            });
    });

    it('Login::success', function (done) {
        request.post('/api/user/signin')
            .send({
                username: 'airyland',
                password: '123456'
            })
            .expect('Content-Type', /json/)
            .expect('Set-cookie', /connect\.sid/)
            .end(function (err, res) {
                res.body.data.username.should.equal('airyland');
                done();
            });
    });

    it('Login::fail', function (done) {
        request.post('/api/user/signin')
            .send({
                username: 'airyland',
                password: '247225'
            })
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.body.msg.should.equal('wrong username or password');
                done();
            });
    });
 
});