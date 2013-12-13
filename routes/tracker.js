var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Track = mongoose.model('usertrack', {
    // visitor id
    uuid: String,
    // website uid
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

// generate uuid
var createUUID = function () {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};

module.exports = {
    track: function (req, res) {
        // get cookie
        var uuid;
        if (req.cookies.uuid) {
            uuid = req.cookies.uuid;
        } else {
            uuid = createUUID();
            res.cookie('uuid', uuid, {maxAge: 10 * 365 * 24 * 3600 * 1000});
        }

        var query = req.query;
        var datas = {
            uid: parseInt(req.query.uid, 10),
            action: req.query.action,
            actionDetails: req.query.actionDetails,
            clientDetails: req.query.clientDetails
        };

        datas.uuid = uuid;

        if (!datas.clientDetails) datas.clientDetails = {};
        datas.clientDetails.ip = req.ip;
        var ip = req.ip;
        var track = new Track(datas);
        track.save(function (err) {
            if (err) throw err;
            res.send(204);
        });
    }
};