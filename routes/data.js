var mongoose = require('mongoose');
// 数据源
var Data = mongoose.model('Data', {
    name: String,
    type: String, //数据类型，ga || umeng || seedit,
    chartType: String, // 图表类型
    option: mongoose.Schema.Types.Mixed // 选项为复杂类型
});

exports.data = {
    list: function(req, res) {
        Data.find({}, function(err, data) {
            res.send({
                error: 0,
                data: data
            })
        })
    },
    add: function(req, res) {
        var data = new Data(req.body);

        data.save(function(err, item) {
            if (err) throw err;
            res.send({
                error: 0,
                msg: '保存成功',
                data: item
            });
        });
    },
    put: function(req, res) {
        var id = req.params.id;
        delete(req.body._id);
        Data.findByIdAndUpdate(id, req.body, function(err) {
            if (err) {
                res.send({
                    error: 1,
                    msg: err
                });
            }

            res.send({
                error: 0,
                msg: err
            });
        })

    },
    get: function(req, res) {
        var id = req.params.id;
        Data.findById(id, function(err, data) {
            if (err) throw err;
            res.send({
                error: 0,
                data: data
            });
        })
    },
    delete: function(req, res) {
        var id = req.params.id;
        /*console.log(Data.findByIdAndRemove);
    Data.findByIdAndRemove(id, function(err) {
      if (err) throw err;
      res.send({
        erro: 0,
        msg: '删除成功'
      });
    })*/
        /* Data.remove({
      _id: id
    }, function(err) {
      if (err) throw err;
      res.send({
        error: 0,
        msg: '删除成功'
      });
    });*/
        Data.findOneAndRemove({
            _id: id
        }, function(err) {
            console.log(err);
        })
    }
}