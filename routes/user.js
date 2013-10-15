var mongoose = require('mongoose');
var User = mongoose.model('User', {
    username: String,
    password: String,
    flag: {
        type: Number,
        default: 0
    }
});
exports.user = {
    list: function(req, res) {
        User.find({}, 'username flag', function(err, data) {
            res.send({
                error: 0,
                data: data
            });
        });
    }
}