var mongoose = require('mongoose'),
    EventProxy = require('eventproxy');
    querystring = require('querystring'),
    moment = require('moment'),
    util = require('util');
var validator = require('../middlewares/reqValidator');
var validate = validator.validate;


// common data put API
var DataStore = require('../models/Datastore');

module.exports = {
    addOne: function (req, res) {
      
    },
    listSchema :  {
        'bucket': {
          type:'isLength 3',
          required:true
        },
        'start-date':{
          type:'isDate',
          required:true
        },
        'end-date':{
          type:'isDate',
          required:true
        }
      },
    list: function (req, res, next) {
      var filters = querystring.parse(req.query.filters);   

        var startDate = new Date(req.query['start-date']);
        var endDate = new Date(req.query['end-date']);

        filters['date'] = {
            $gte: startDate,
            $lt: endDate
        };

        DataStore.find(filters).select('-type').sort('date').exec(function (err, data) {
          if(err){
            return next(err);
          } 
          
            if(data.length===0){
              return res.send({
                error: 0,
                sum: 0,
                rows: []
              });
            }else{
            var rs = data.map(function (one) {
                if (typeof one.data === 'string') one.data = [one.data];
                one.data.unshift(moment(one.date).format("YYYY-MM-DD"));
                return one.data;
            });
            }
         
            res.send({
                error: 0,
                sum: (function () {
                    return rs.map(function (one) {
                        return one[1]
                    }).reduce(function (p, n) {
                            return p * 1 + n * 1;
                        });
                })(),
                rows: rs
            });
        })
    },
    add: function (req, res, next) {
        var datas = req.query;
        /**
        if (!datas.type || !datas.date) {
            res.send({
                error: 1,
                msg: 'no data specified'
            });
            return;
        }
        **/
        // check if exists
        var ep = EventProxy.create('exist', function (exist) {
            if (exist === 0) {
                var data = new DataStore(datas);
                data.save(function (err) {
                    if(err) return next(err);
                    res.send({
                        error: 0,
                        msg: 'insert successfully'
                    });
                });
            } else {
                DataStore.findOneAndUpdate({type: datas.type, date: datas.date}, datas, function (err) {
                    if(err) return next(err);
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
