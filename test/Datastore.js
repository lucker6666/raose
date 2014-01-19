var request = require('supertest');
var should = require('should');
var assert = require('assert');
var server = require('../server');
var app = server.app,
    request = request(app);


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

    request.get('/api/datastore/export.json?filters='+filters)
      .expect('Content-Type',/json/)
      .end(function(err,res){
        console.log(res.body);
        res.body.error.should.equal(1002);
        //res.body.msg.should.equal('arg missing: start-date');
        done();
      });
  });
    
});