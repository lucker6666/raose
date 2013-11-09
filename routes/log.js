var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Log = mongoose.model('log', {
    // create time
    create_at: {
        type: Date,
        default: Date.now
    },
    // type
    type: String,
    // opera
    operator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // details
    details: Object
});

module.exports = {
    // insert a log
    add: function(data, callback) {
        var log = new Log(data);
        log.save(function(err, item) {
            callback && callback(err, item);
        });
    }
};