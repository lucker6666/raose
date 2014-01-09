var mongoose = require('./lib/mongoose');
var server = require('./server');
server.start();

var kue = require('kue');
kue.app.listen(3000);
console.log('start kue server on port 3000');