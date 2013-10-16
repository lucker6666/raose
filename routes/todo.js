// todo 
var mongoose = require('mongoose');
var MessageModel = require('./message.js').MessageModel;
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
  }
});
exports.Model = Todo;
exports.todo = {
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