var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var appSchema = Schema({
    // app name
    name: {
        type: String,
        required: true
    },
    // description
    desc: String,
    // icons
    icons: {
        icon_64: String,
        icon_256: String
    },
    site: {
        type: String,
        required: true
    },
    callback_url: {
        type: String,
        required: true
    },
    // 1=>web app, 2=>desktop app, 3=>mobile app
    type: {
        type: String,
        enum: ['1', '2', '3']
    },
    applied_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    applied_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    has_passed: {
        type: Boolean,
        default: false
    },
    passed_at: Date,
    // app key
    app_key: String,
    // app secret
    app_secret: String
});