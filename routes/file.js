/**
 * File Model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var File = mongoose.model('File', {
    // name
    name: String,
    // owner
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // belong to 
    dir: String,
    // create time
    create_at: Date,
    // version
    version: Number
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
            })
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