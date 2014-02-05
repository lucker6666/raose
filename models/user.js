var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validate = require('mongoose-validator').validate,
    uuid = require('node-uuid'),
    tokenHelper = require('../lib/token'),
    Email = require('../controllers/Email')

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
        token: String,
        // email actived
        active_metas: {
          has_sent_actived_email:{
            type: Boolean,
            default: false
          },
          send_actived_email_at: Date,
          has_actived:{
            type: Boolean,
            default: false
          },
          actived_at: Date
        },
        // notification option
        notification:{
            task_assign:{
                email: Boolean
            },
            issue_assign:{
                email: Boolean
            },
            comment_mention:{
                email: Boolean
            },
            be_joined:{
                email: Boolean
            }
        }
        
    });

// search method
userSchema.statics.searchUserByName = function(name, callback) {
    var reg = new RegExp(name);
    this.find({
        $or: [
            [{
                username: reg
            }],
            [{
                realname: reg
            }],
            [{
                email: reg
            }]
        ]
    }).exec(function(err, items) {
        callback(err, items);
    });
};

// generate secret and token
userSchema.pre('save', function(next) {
    // generate secret
    var secret = uuid.v1();
    // generate token
    var payload = {
        username: this.username
    };
    var token = tokenHelper.encode(payload, secret);
    this.secret = secret;
    this.token = token;
    next();
});

/**
* send actived email
*/
userSchema.post('save', function(item) {
    Email.createJob({
        username: item.username
    });
});

var User = mongoose.model('User', userSchema);
module.exports = User;
