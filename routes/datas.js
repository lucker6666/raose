var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var EventProxy = require('eventproxy');
// common data put API

var DataStore = mongoose.model('datastore', {
    type: String,
    date: Date,
    data: Object
});


module.exports = {
    add: function (req, res) {
        var datas = req.query;

        if(!datas.type || !datas.date){
            res.send({
                error:1,
                msg:'no data specified'
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
