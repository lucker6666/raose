var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = Schema({
    // project name
    name: {
        type: String,
        required: true
    },
    // created time
    created_at: {
        type: Date,
        default: Date.now
    },
    // created by
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // has archived ?
    archived: {
        type: Boolean,
        default: false
    },
    // followers
    followers: Array,
    // modified date
    modified_at: Date,
    // modified by
    modified_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    color: String,
    // cached metas
    metas: {
        tasks: {
            all: {type: Number, default: 0},
            finish: {type: Number, default: 0}
        },
        issues: {
            all: {type: Number, default: 0},
            finish: {type: Number, default: 0}
        },
        docs: {type: Number, default: 0},
        files: {type: Number, default: 0}
    }
});


module.exports = mongoose.model('project', ProjectSchema);
