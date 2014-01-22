var request = require('supertest');
var should = require('should');
var assert = require('assert');
var server = require('../server');
var app = server.app,
    request = request(app);
var code = require('../lib/error_code');

describe('GET /api/userinfo.js', function () {
    var databaseConfig = require('../config/database.json');
    var serverHandler;
    before(function (done) {
      serverHandler = server.start(0,done);
    });         
    after(function(){
      serverHandler.close();
    });

    it('should return null userinfo',function(done){
    request.get('/api/userinfo.js')
      .expect('Content-Type','application/javascript')
      .expect('Content-Length',13)
      .end(function(err,res){
        console.log(res);
        //res.body.should.equal('var user=null');
        done();
      });
  });
     
});