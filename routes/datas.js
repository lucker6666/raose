var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var EventProxy = require('eventproxy');
var querystring = require('querystring');
var moment = require('moment');
// common data put API

var DataStore = mongoose.model('datastore', {
    type: String,
    date: Date,
    data: Object
});


module.exports = {
    addOne: function (req, res) {

    },
    list: function (req, res) {
        var filters = querystring.parse(req.query.filters);
        if (!filters) {
            filters = {};
        }
        // start-date
        // end-date
        if (!req.query['start-date']) res.send({
            error: 1,
            msg: 'param start-required'
        });

        if (!req.query['end-date']) res.send({
            error: 1,
            msg: 'param end-required'
        });


        var startDate = new Date(req.query['start-date']);
        var endDate = new Date(req.query['end-date']);

        filters['date'] = {
            $gte: startDate,
            $lt: endDate
        };

        DataStore.find(filters).select('-type').sort('date').exec(function (err, data) {
            var rs = data.map(function (one) {
                if (typeof one.data === 'string') one.data = [one.data];
                one.data.unshift(moment(one.date).format("YYYY-MM-DD"));
                return one.data;
            });
            res.send({
                error: 0,
                rows: rs
            });
        })
    },
    add: function (req, res) {
        var datas = req.query;

        if (!datas.type || !datas.date) {
            res.send({
                error: 1,
                msg: 'no data specified'
            });
            return;
        }
        // check if exists
        var ep = EventProxy.create('exist', function (exist) {
            if (exist === 0) {
                var data = new DataStore(datas);
                data.save(function (err) {
                    res.send({
                        error: 0,
                        msg: 'insert successfully'
                    });
                });
            } else {
                DataStore.findOneAndUpdate({type: datas.type, date: datas.date}, datas, function (err) {
                    res.send({
                        error: 0,
                        msg: 'update successfully'
                    });
                })
            }
        });

        DataStore.count({type: datas.type, date: datas.date}, function (err, count) {
            ep.emit('exist', count);
        });
    }
};
