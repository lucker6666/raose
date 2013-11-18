var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Track = mongoose.model('usertrack', {
    uid: Number,
    // action name
    action: String,
    // the browser info and ip info
    clientDetails: Object,
    // action details
    actionDetails: Object,
    // time
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    track: function(req, res) {
        var query = req.query;
        var datas = {
            uid: parseInt(req.query.uid, 10),
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