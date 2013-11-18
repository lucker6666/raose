var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Track = mongoose.model('usertrack', {
    uid: Number,
    action: String,
    clientDetails: Object,
    actionDetails: Object,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    track: function(req, res) {
        var query = req.query;
        var datas = {
            uid: req.query.uid,
            action: req.query.action,
            actionDetails: req.query.actionDetails,
            clientDetails: req.query.clientDetails
        };
        if (!datas.clientDetails) datas.clientDetails = {};
        datas.clientDetails.ip = req.ip
        var ip = req.ip;
        var track = new Track(datas);
        track.save(function(err) {
            if (err) throw err;
            res.send(204);
        });
    }
};