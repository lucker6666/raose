var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validate = require('mongoose-validator').validate,
    uuid = require('../lib/uuid.js'),
    jwt = require('jwt-simple');

var userSchema = mongoose.Schema({
    // username
    username: {
        type: String,
        unique: true
    },
    // created date
    created_at: {
        type: Date,
        default: Date.now
    },
    // password
    password: String,
    // role flag
    flag: {
        type: Number,
        default: 0
    },
    // realname
    realname: {
        type: String,
        default: ''
    },
    // email
    email: {
        type: String,
        default: '',
        unique: true
    },
    // avatar
    avatar: {
        type: String,
        default: '/avatar/default.png'
    },
    // secret to generate token
    secret: String,
    // token
    token: String
});

// generate secret and token
userSchema.pre('save', function(next) {
    // generate secret
    var secret = uuid.create();
    // generate token
    var payload = {
        username: this.username
    };
    var token = jwt.encode(payload, secret);
    this.secret = secret;
    this.token = token;
    next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;