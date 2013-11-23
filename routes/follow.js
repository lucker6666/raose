var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var baseModelProp = {
    //type
    type: String,
    // keyid, maybe not a good design
    id: String,
    // uid
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // date
    create_at: {
        type: Date,
        default: Date.now
    },
    // following details
    dataDetails: {
        type: Schema.Types.ObjectId,
        ref: 'Data'
    }
};

var Follow = mongoose.model('follow', baseModelProp);

var addFollow = function(data, callback) {
    var item = new Follow(data);
    item.save(function(err, item) {
        callback && callback(err, item);
    });
};
module.exports = {
    // add follow
    add: addFollow,
    // deal with controller
    restAdd: function(req, res) {
        req.body.user = req.user.uid;
        if (req.body.type === 'data') {
            req.body.dataDetails = req.body.id;
        };
        addFollow(req.body, function(err, item) {
            res.send({
                error: 0,
                data: item
            });
        });
    },
    getDataFollowings: function(req, res) {
        Follow.find({
            type: 'data',
            id: req.params.id
        }).populate('user', '-password').exec(function(err, data) {
            res.send({
                error: 0,
                data: data
            })
        })
    },
    delete: function(req, res) {
        Follow.findOneAndRemove({
            user: req.user.uid,
            id: req.params.id,
            type: 'data'
        }, function(err) {
            if (err) throw err;
            res.send({
                error: 0,
                msg: '删除成功'
            });
        })
    },
    list: function(req, res) {
        var uid = req.user.uid;
        var type = req.query.type;
        Follow.find({
            user: uid,
            type: type
        }, '', {
            sort: {
                create_at: -1
            }
        }).populate('dataDetails').exec(function(err, data) {
            res.send({
                error: 0,
                data: data
            })
        });
    },
    get: function(req, res) {
        Follow.findOne({
            user: req.user.uid,
            type: req.query.type,
            id: req.params.id
        }).exec(function(err, data) {
            res.send({
                error: 0,
                data: data
            })
        })
    }
};