// todo 
var mongoose = require('mongoose');
var MessageModel = require('./message.js').MessageModel;
var Discussion = require('./discussion.js').Model;
var Todo = mongoose.model('Todo', {
  // 标题
  title: String,
  // 时间
  date: {
    type: Date,
    default: Date.now
  },
  // todo描述
  desc: String,
  // 状态
  status: {
    type: String,
    default: '待处理'
  },
  // 作者
  author: {
    type: String,
    default: '管理员'
  },
  // 指派给
  owner: {
    type: String,
    default: '无指派'
  },
  // 私有，自己可见
  private: {
    type: Boolean,
    default: false
  }
});
exports.Model = Todo;
exports.todo = {
  // 获取单个issue的回复
  getDiscussions: function(req, res) {
    var issueId = req.params.id;
    Discussion.find({
      type: 'todo',
      typeId: issueId
    }, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      });
    });
  },
  // 添加一个评论
  addDiscussion: function(req, res) {
    req.body.author = req.user.username;
    var discussion = new Discussion(req.body);
    discussion.save(function(err, item) {
      if (err) throw err;
      res.send({
        erro: 0,
        msg: '添加成功',
        data: item
      });
    });
  },
  // 更新
  put: function(req, res) {
    var id = req.params.id;
    var action = req.body.action;
    Todo.findByIdAndUpdate(id, req.body, function(err, item) {
      // 更新状态
      if (action === 'updateStatus') {
        MessageModel.add({
          from: req.user.username,
          to: 'all',
          content: {
            action: '更新处理状态',
            target: item.title,
            link: '/todo/' + item._id,
            end: item.status
          }
        }, function(err, msg) {
          res.send({
            error: 0,
            msg: '更新成功',
            data: item,
            msg: msg
          });
        });
      }
    });
  },
  // 添加
  add: function(req, res) {
    req.body.author = req.user.username;
    // 无指派时为自己
    if (!req.body.owner) {
      req.body.owner = req.user.username;
    }
    var todo = new Todo(req.body);
    todo.save(function(err, item) {
      if (err) console.log('保存todo出错鸟');
      MessageModel.add({
        from: req.user.username,
        to: req.body.owner,
        content: {
          action: '指派了Todo任务',
          target: req.body.title,
          link: '/todo/' + item._id
        }
      }, function(err, item) {
        console.log(err);
        console.log(item);
        res.json({
          error: 0,
          data: item
        });
      });

    });

  },
  // 列表
  list: function(req, res) {
    Todo.find({}, null, {
      sort: {
        date: -1
      }
    }, function(err, data) {
      res.json({
        error: 0,
        data: data
      });
    })
  },
  get: function(req, res) {
    Todo.findById(req.params.id, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      });
    })
  },
  delete: function(req, res) {
    Todo.findByIdAndRemove(req.params.id, function(err) {
      if (err) throw err;
      res.send({
        error: 0,
        msg: '删除成功'
      });
    })
  }
};