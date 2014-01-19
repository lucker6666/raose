var request = require('supertest');
var should = require('should');
var assert = require('assert');
var server = require('../server');
var app = server.app,
    request = request(app);
var code = require('../lib/error_code');

describe('Upload', function () {
    var databaseConfig = require('../config/database.json');
    var serverHandler;
    before(function (done) {
      serverHandler = server.start(0,done);
    });         
    after(function(){
      serverHandler.close();
    });

  
    it('should return error 0',function(done){
    request.post('/api/upload')
      .attach('file', './test/avatar.png')
      .expect('Content-Type',/json/)
      .end(function(err,res){
        res.body.error.should.equal(0);
        done();
      });
  });
     
});