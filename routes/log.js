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
    Model: Log,
    // insert a log
    add: function(data, callback) {
        var log = new Log(data);
        log.save(function(err, item) {
            callback && callback(err, item);
        });
    },
    list: function(req, res) {
        var type = req.params.type;
        var uid = req.query.uid;
        var query = {
            type: type
        };
        if (uid) {
            query.operator = uid;
        }

        Log.find(query, null, {
            sort: {
                create_at: -1
            }
        }).populate('operator', '-password -email').exec(function(err, data) {
            res.send({
                error: 0,
                data: data
            });
        });

    }
};