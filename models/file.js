var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema,
    validate = require('mongoose-validator').validate;

var File = mongoose.model('File', {
    // 0 for file, 1 for folder
    type: Number,
    // name
    name: {
        type: String,
        required: true,
        validate: [validate({
            message: 'name shoud has at least 3 characters'
        }, 'len', 3, 50)]
    },
    // path
    path: String,
    // size
    size: Number,
    // ext
    ext: String,
    // owner
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // belong to 
    folder: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    // create time
    create_at: Date,
    // file may has a version control
    version: Number,
    // if everyone can see it
    public: {
        type: Boolean,
        default: true
    }
});

module.exports = File;