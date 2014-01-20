var request = require('supertest');
var should = require('should');
var assert = require('assert');
var server = require('../server');
var app = server.app,
    request = request(app);
var code = require('../lib/error_code');
var io = require('socket.io-client')

describe('Socket', function () {
    var databaseConfig = require('../config/database.json');
    var serverHandler;
    before(function (done) {
      serverHandler = server.start(8000,done);
    });         
    after(function(){
      serverHandler.close();
    });
  
  it('should be connected',function(done){
    this.timeout(5000);
    var socket = io.connect('http://localhost:8000');
        socket.on('connect', function() {
            console.log('Yeah, connected!');
            done();
        });
  });
});