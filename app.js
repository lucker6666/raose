var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/raose');
var server = require('./server');
server.start();