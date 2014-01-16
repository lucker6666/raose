var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

/**
 *  Datapool is used to save some processed data instead of datas with timeline
 *
 */
var Datapool = mongoose.model('datapool', {
    name: String,
    data: Object
});

module.exports = {
    get: function (req, res) {
        Datapool.findOne({name: req.query.name}).exec(function (err, item) {
            if(item){
              item.data = JSON.parse(item.data);
            }
            res.send({
                error: 0,
                data: item
            });
        });
    },
    set: function (req, res) {
        var data = req.query;
        console.log(data);
        // find if exists
        Datapool.findOne({name: data.name}).exec(function (err, item) {
            if (err) throw err;
            console.log(item);
            // insert
            if (!item) {
                var datapool = new Datapool(data);
                datapool.save(function (err, item2) {
                    if (err) throw err;
                    res.send({
                        error: 0,
                        msg: 'insert successfully'
                    });
                });
            } else {
                Datapool.update({_id: item._id}, data, function (err, item3) {
                    if (err) throw err;
                    res.send({
                        error: 0,
                        msg: 'update successfully',
                        data: item3
                    });
                });
            }
        });
    }
};