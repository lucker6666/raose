/**
 * 需求
 * 需求可加成员，成员可看数据，成员可以看到需求动态，其他人可以关注需求进展
 */
var mongoose = require('mongoose');
// 为需求添加文档
var Feature = mongoose.model('Feature', {
  // 作者
  author: String,
  // 日期
  date: {
    type: Date,
    default: Date.now
  },
  // 标题 
  title: String,
  // 内容
  content: String,
  // 成员
  members: Array
});

exports.feature = {
  add: function(req, res) {
    req.body.author = req.user.username;
    var feature = new Feature(req.body);
    feature.save(function(err) {
      if (err) throw err;
      res.send({
        error: 0,
        msg: '添加成功'
      });
    });
  },
  list: function(req, res) {
    Feature.find({}, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      })
    })
  },
  get: function(req, res) {
    var id = req.params.id;
    Feature.findById(id, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      });
    });
  },
  delete: function(req, res) {
    var id = req.params.id;
    Feature.findByIdAndRemove(id, function(err) {
      if (err) throw err;
      res.send({
        erro: 0,
        msg: '删除成功'
      });
    })
  },
  put: function(req, res) {
    var id = req.params.id;
    Feature.findByIdAndUpdate(id, req.body, function(err, item) {
      res.send({
        errro: 0,
        data: item
      });
    });
  }
};