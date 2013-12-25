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

var Tracks = mongoose.model('tt', {
    url: String
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

var sendError = function (res, code, msg) {
    res.send({
        error_code: code,
        msg: msg
    });
    return;
};

module.exports = {
    list: function (req, res) {
        var dimensions, metrics, query, sort = 'created_at', select = '*';
        var action = req.query.action,
            startTime = req.query['start-date'],
            endTime = req.query['end-date'];

        // action
        if (!action) sendError(res, -1, 'action param required');

        // time params
        if (!startTime) sendError(res, -1, 'start-date param required');
        if (!endTime) sendError(res, -1, 'end-date param required');

        // max-results param
        var maxResult = req.query['max-results'] ? req.query['max-results'] : 100;
        if (!maxResult)  maxResult = 100;
        if (maxResult > 2000) maxResult = 2000;

        // filter

        // dimension
        dimensions = !req.query.dimensions ? 'date' : req.query.dimensions;

        // metrics
        if (!req.query.metrics) metrics = 'totalEvents';

        // query
        query = {
            action: action,
            created_at: {
                "$gte": new Date(startTime),
                "$lt": new Date(endTime)
            }
        };

        // sort
        if (req.query.sort) sort = req.query.sort;


        // select
        if (req.query.metrics) select = req.query.metrics;

        select = (select + ' ' + dimensions + ' ' + sort).replace(/ip/, 'clientDetails.ip')
            .replace(/useragent/, 'clientDetails.useragent')
            .replace(/date/, 'created_at')
            .replace(/-/, '');

        Track.find(query).select(select).limit(maxResult).sort(sort).exec(function (err, data) {
            // flat the array

            res.send({
                error: 0,
                itemsPerPage: maxResult,
                totalResults: data.length,
                data: data
            });
        });
    },
    track_test: function (req, res) {
        var data = new Tracks({url: req.originalUrl});
        data.save(function (err, item) {
            if (err) throw err;
            res.send(204);
        });
    },
    track: function (req, res) {
        // get cookie
        var uuid;
        if (req.cookies.uuid) {
            uuid = req.cookies.uuid;
        } else {
            // set uuid if has not set
            uuid = createUUID();
            res.cookie('uuid', uuid, {maxAge: 10 * 365 * 24 * 3600 * 1000});
        }

        // if set uid, then add a task to make the data belong to the specified uid
        if (req.query.uid) {
            // @todo
        }

        var query = req.query;
        var datas = {
            uid: req.query.uid ? req.query.uid : 0,
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