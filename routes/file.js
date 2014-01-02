/**
 * File and Foler Model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var File = mongoose.model('File', {
    // 0 for file, 1 for folder
    type: Number,
    // name
    name: String,
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

module.exports = {
    // add a file
    add: function(req, res) {
        req.body.owner = req.user.uid;
        var file = new File(req.body);
        file.save(function(err, item) {
            res.send({
                error: err,
                data: item
            });
        });
    },
    // list files
    list: function(req, res) {
        File.find({}).populate('owner', '_id username avatar').exec(function(err, data) {
            res.send({
                error: 0,
                data: data
            });
        });
    },
    get: function(req, res) {
        File.findById(req.params.id).populate('owner', '_id username avatar').exec(function(err, data) {
            res.send({
                error: 0,
                data: data
            });
        });
    }
};