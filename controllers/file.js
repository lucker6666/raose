var File = require('../models/file');
module.exports = {
    add: function(data, callback) {
        var file = new File(data);
        file.save(function(err, item) {
            var error;
            if (err) err = err.errors.name.message
            callback(err, item);
        });
    },
    list: function(callback) {
        File.find({}).exec(function(err, data) {
            var error;
            if (err) err = err.errors.name.message
            callback(err, data);
        });
    }
};