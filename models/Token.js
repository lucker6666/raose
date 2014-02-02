var mongoose = require('./lib/mongoose');
var tokenSchema = mongoose.Schema({
    app_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'App',
        require: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    token: {
        type: String,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('token', tokenSchema);
