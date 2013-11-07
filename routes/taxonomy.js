var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Tax = mongoose.model('taxonomy', {
    // type
    type: String,
    // created date
    create_at: Date,
    // by whom
    create_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // name
    name: String,
    // order
    order: Number
});

module.exports = {
    // add taxonomy
    add: function(req, res) {
        var data = req.body;
        data.create_at = new Date();
        data.create_by = req.user.uid;
        var tax = new Tax(data);
        tax.save(function(err, item) {
            if (err) throw err;
            res.send({
                error: 0,
                data: item
            });
        });
    },
    // list taxonomy by type
    list: function(req, res) {
        var type = req.query.type;
        Tax.find({
            type: type
        }).populate('create_by', '-password -__v -email').exec(function(err, data) {
            res.send({
                error: 0,
                data: data
            });
        });
    },
    // get single one
    get: function(req, res) {
        Tax.findById(req.params.id, function(err, item) {
            res.send({
                error: 0,
                data: item
            });
        });
    },
    update: function(req, res) {

    }
};