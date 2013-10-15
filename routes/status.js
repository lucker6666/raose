var mongoose = require('mongoose');
// 状态
var Status = mongoose.model('Status', {
  name: String,
  desc: String
});

// 站内消息

exports.status = {

  // 添加
  add: function(req, res) {
    var status = new Status(req.body);
    Status.find({
      name: req.body.name
    }, function(err, data) {
      if (data.length) {
        console.log('已经存在啦');
      } else {
        status.save(function(err) {
          if (err) console.log('保存出错鸟');
          console.log('状态保存成功');
        });
      }
      res.json(true);
    })
  },

  // 列表
  list: function(req, res) {
    Status.find({}, function(err, data) {
      res.json({
        error: 0,
        data: data
      });
    })
  },

  // 获取单条
  get: function(req, res) {
    var id = req.params.id;
    Status.find({
      _id: id
    }, function(err, data) {
      res.json({
        error: 0,
        data: data
      })
    })
  },

  // 更新
  update: function(req, res) {
    var id = req.params.id;
    Status.update({
      _id: id
    }, req.body, function(err) {
      console.log(err);
    })
  },

  delete: function(req, res) {
    var id = req.params.id;
    Status.remove({
      _id: id
    }, function(err) {
      if (err === null) {
        res.send({
          error: 0,
          msg: '删除成功'
        })
      }
    })
  }
};