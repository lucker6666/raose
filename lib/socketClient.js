/**
* Usage::
* var io = require('./socketClient');
* io.emit('log','socket client lib test ::　hello world');
*/

var io = require('socket.io-client');
var socket = io.connect('http://localhost:8004');
exports.emit = function(event,data){
  socket.on('connect', function() {
    socket.emit(event,data);
    socket.disconnect();
  });
};
