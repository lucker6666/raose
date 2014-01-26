// sockets.js
var socketIo = require('socket.io')

module.exports.listen = function(app){
    
    var io = socketIo.listen(app);
    
    io.sockets.on('connection', function (socket) {
      socket.emit('Hello world', { message: 'welcome to the Raose socket server' });
      socket.on('log', function (data) {
          console.log('[Socket log]'.green, data.green);
      });
    });

    return io;
}

