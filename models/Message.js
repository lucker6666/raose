var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;
var messageSchema = Schema({
    // message type
    type: {
        type: String,
        required: true,
        enum: ['issue', 'reply', 'mention', '']
    },
    // created date
    created_at: {
        type: Date,
        default: Date.now
    },
    // sender
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // receiver
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // has read
    has_read: {
        type: Boolean,
        default: false
    },
    read_at: Date,
    // message content
    content: {
        // 添加了数据源
        action: String,
        // BBS流量来源
        target: String,
        // 链接
        link: String,
        // 末尾其他信息
        end: {
            type: String,
            default: ''
        }
    },
    // on which platform to trigger the message
    source: {
        type: String,
        enum: ['web', 'email', 'wap', 'apiss', 'android', 'ios']
    }
});

/**
 * action:['set_read']
 */

// set message read
// @doubt whether to check if the message has been set read
messageSchema.statics.setRead = function (id, callback) {
    this.findByIdAndUpdate(id, {$set: {
        has_read: true,
        read_at: Date.now()
    }}, function (err) {
        callback(err);
    });
};


module.exports = mongoose.model('message', messageSchema);
