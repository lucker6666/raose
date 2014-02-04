var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var chatSchema = mongoose.model('chat', {
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

// when created, broadcast to the project room
// @todo
chatSchema.pre('save', function (next) {
    next();
});

// create a chat message
chatSchema.statics.create = function (data, callback) {
    this.create(data, callback);
};

// list messages by project
chatSchema.statics.listByProject = function (project, page, limit, callback) {
    this.find({project: project}).paginate(page, limit).exec(callback);
};


module.exports = mongoose.model('chat', chatSchema);
