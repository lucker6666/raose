var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

// tasklist Schema
var tasklistSchema = Schema({
  // list name
  name:{
    type: String,
    required: true
  },
  // list description
  note:String,
  // workspace id
  workspace_id:{
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  // task number
  tasks_count:{
    type: Number,
    default: 0
  },
  // created by
  created_by:{
     type: Schema.Types.ObjectId,
     ref: 'User',
  },
  created_at:{
    type: Date,
    default: Date.now
  },
  updated_by:{
     type: Schema.Types.ObjectId,
     ref: 'User',
  },
  updated_at: Date,
  archived: {
    type: Boolean,
    default: false
  },
  archived_at: Date
});

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
    archived_at: Date,
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
    // task list
    tasklist: [tasklistSchema],
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
