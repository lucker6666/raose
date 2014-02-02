var mongoose = require('mongoose');
// pagination extend
require('./mongoosePaginate');
var databaseConfig = require('../config/database.json');
mongoose.connect('mongodb://localhost/' + databaseConfig.database);

// when connect error, exit the app
mongoose.connection.on('error', function (err) {
    console.log('[Mongoose Error]'.red, err.toString().red);
    console.log('[Mongoose Error tip]'.cyan, 'Start Mongodb first~'.cyan);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

module.exports = mongoose;