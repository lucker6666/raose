var server = require('./server');
var toobusy = require('toobusy');
server.start();

var kue = require('kue');
kue.app.listen(3000);
console.log('start kue server on port 3000');

// close mongoose connection
process.on('SIGINT', function() {
    var mongoose = require('./lib/mongoose');
    toobusy.shutdown();
    mongoose.connection.close(function() {
        console.log("\n",'[Mongoose info]'.green,'Mongoose disconnected through app termination'.green);
        process.exit(0);
    });
});