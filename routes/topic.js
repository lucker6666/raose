var Discussion = require('./discussion.js').Model;
var Topic = require('../models/Topic');

// 讨论相关
exports.topic = {
  // 添加讨论
  add: function(req, res) {
    req.body.author = req.user.username;
    var topic = new Topic(req.body);
    topic.save(function(err) {
      if (err) throw err;
      res.send({
        error: 0,
        msg: '添加成功'
      });
    });
  },
  // 列表
  list: function(req, res) {
    Topic.find({}, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      })
    })
  },
  // 获取一个讨论
  get: function(req, res) {
    Topic.findById(req.params.id, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      });
    })
  },
  // 添加一个评论
  addDiscussion: function(req, res) {
    req.body.author = req.user.username;
    var discussion = new Discussion(req.body);
    discussion.save(function(err) {
      if (err) throw err;
      res.send({
        erro: 0,
        msg: '添加成功'
      });
    });
  },
  // 获取单个讨论的回复
  getDiscussions: function(req, res) {
    var topicId = req.params.id;
    Discussion.find({
      type: 'topic',
      typeId: topicId
    }, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      });
    });
  },
  // 删除单个回复
  // @todo 作权限检测 
  removeDisussion: function(req, res) {
    var id = req.params.id;
    Discussion.findByIdAndRemove(id, function(err) {
      if (err) throw err;
      res.send({
        erro: 0,
        msg: '删除成功'
      });
    });
  }
};