var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema,
    validate = require('mongoose-validator').validate;

var TaskSchema = Schema({
    // name
    name: {
        type: String,
        required: true
    },
    // created date
    created_at: {
        type: Date,
        default: Date.now
    },
    // created member
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // has been archived?
    archived: {
        type: Boolean,
        default: false
    },
    // has been done?
    completed: {
        type: Boolean,
        default: false
    },
    // expired date
    expire_date: Date,
    // belong to task
    task_id: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Issue'
    },
    // assign to
    assign_to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // position used for order
    position: Number,
    // other info
    metas: Object
});

// search tasks
TaskSchema.statics.search = function (query, page, limit, callback) {
    this.find({name: new RegExp(query)}).paginate(page, limit).exec(callback);
};


module.exports = mongoose.model('task', TaskSchema);