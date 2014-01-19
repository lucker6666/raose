var request = require('supertest');
var should = require('should');
var assert = require('assert');
var server = require('../server');
var app = server.app,
    request = request(app);
var code = require('../lib/error_code');


describe('Datastore', function () {
    var databaseConfig = require('../config/database.json');
    var serverHandler;
    before(function (done) {
      serverHandler = server.start(0,done);
    });         
    after(function(){
      serverHandler.close();
    });

    /**
  * Datastore test
  */
  
 
  var querystring = require('querystring');
  it('should error with missing start-date',function(done){
    
    var filters = encodeURIComponent(querystring.stringify({
      'end-date':'aaa'
    }));                                            
    request.get('/api/datastore/export.json')
      .expect('Content-Type',/json/)
      .end(function(err,res){
        res.body.error.should.equal(code['ARG_MISSED'][0]);
        res.body.msg.should.equal('missing arg:start-date');
        done();
      });
  });
  
   it('should error with start-date wrong type',function(done){
    var filters = encodeURIComponent(querystring.stringify({
      'start-date':'aaa'
    }));                                            
    request.get('/api/datastore/export.json?filters='+filters)
      .expect('Content-Type',/json/)
      .end(function(err,res){
        res.body.error.should.equal(code['ARG_WRONG_TYPE'][0]);
        res.body.msg.should.equal('arg type not match:start-date');
        done();
      });
  });
  
  
    
});