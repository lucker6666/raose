var request = require('supertest');
var should = require('should');
var assert = require('assert');
var server = require('../server');
var app = server.app,
    request = request(app);
var code = require('../lib/error_code');

describe('Timeout', function () {
    var databaseConfig = require('../config/database.json');
    var serverHandler;
    before(function (done) {
      serverHandler = server.start(0,done);
    });         
    after(function(){
      serverHandler.close();
    });

 /**
  * Timeout test
  */
  
    it('should return '+ code['TIMEOUT'][0],function(done){
      this.timeout(6000);
    request.get('/api/test/timeout')
      .expect('Content-Type',/json/)
      .end(function(err,res){
        res.body.error.should.equal(code['TIMEOUT'][0]);
        res.body.msg.should.equal(code['TIMEOUT'][1]);
        done();
      });
  });
     
});