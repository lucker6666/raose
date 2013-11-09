var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Follow = mongoose.model('follow', {
    //type
    type: String,
    // uid
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // following details
    details: Object
});

module.exports = {
    // add follow
    add: function(data, callback) {
        var item = new Follow(data);
        item.save(function(err, item) {
            callback && callback(err, item);
        });
    }
};