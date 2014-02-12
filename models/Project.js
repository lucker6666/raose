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

    /**
     * Projects
     * GET     /projects                get all projects
     * POST    /projects                add a project
     *
     * GET     /project/:id             get a project
     * GET     /project/:id/followers   get followers of a project
     * GET     /project/:id/feeds       get action feeds
     * GET     /project/:id/tasklists   get tasklists of a project
     * GET     /project/:id/tasklist/:tasklistid  get tasks of a tasklist
     * GET     /project/:id/tasks       get all tasks of a project
     * PUT     /project/:id             update a project
     * DELETE  /project/:id             delete a project
     * POST    /project/:id/attachments   add an attachments to a project
     *
     */

// create a project
ProjectSchema.statics.create = function(data,callback){
  this.create(data,callback);
};

// list my project
// @todo now return all projects
ProjectSchema.statics.list = function(callback){
  this.find({}).exec(callback);
};

// find one
ProjectSchema.statics.findById = function(id,callback){
  this.findById(id,callback);
};

// add task list
ProjectSchema.statics.addTaskList = function(data,callback){
  
};

module.exports = mongoose.model('project', ProjectSchema);
