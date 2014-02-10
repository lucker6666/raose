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
    // read status
    read_status: {
        // has read
        has_read: {
            type: Boolean,
            default: false
        },
        // read date
        read_at: Date,
        // read platform
        read_source: String
    },
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
        enum: ['web', 'email', 'wap', 'app', 'android', 'ios']
    }
});

/**
 * action:['set_read']
 * filters: rs:read=true|false,rs:from=uid,rs:type=task_done
 */

// set message read
// @doubt whether to check if the message has been set read
messageSchema.statics.setRead = function (id, callback) {
    this.findByIdAndUpdate(id, {$set: {
        has_read: true,
        read_at: Date.now()
    }}, callback);
};

messageSchema.statics.listMessageByUid = function (uid, page, limit, type) {

};


module.exports = mongoose.model('message', messageSchema);
