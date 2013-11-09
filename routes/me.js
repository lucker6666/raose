var json = require('./helper').json;
var mongoose = require('mongoose');
var User = require('./user.js').Model;
var Log = require('./log.js').Model;
// 帖子Model
var Todo = require('./todo.js').Model;
var Issues = require('./issue.js').Model;
exports.me = {
  dataHistory :function(req,res){
    Log.find({operator:req.user.uid,type:'getData'},null,{sort:{create_at:-1}},function(err,data){
     res.send({
   error:0,
data:data
});
  })
  },
  todos: function(req, res) {
    Todo.find({
      owner: req.user.username,
      status: {
        $in: ['处理中', '等待上线', '待处理', '测试中']
      }
    }, function(err, data) {
      json(res, err, data);
    })
  },
  issues: function(req, res) {
    Issues.find({
      owner: req.user.username,
      // only list the open issues
      open: true
    }, function(err, data) {
      res.send({
        error: 0,
        data: data
      });
    });
  },
  // 获取个人资料
  profile: function(req, res) {
    var username = req.user.username;
    User.findOne({
      username: username
    }, '-password', function(err, data) {
      json(res, err, data);
    })
  },
  // 更新资料
  updateProfile: function(req, res) {
    var id = req.body._id;
    delete req.body._id;
    console.log(req.body);
    // 如果新密码为空，则直接保存
    if (!req.body.password) {
      User.findByIdAndUpdate(id, req.body, function(err, item) {
        json(res, err, item);
      });
    } else {
      // 检查旧密码是否相同
      User.findById(id, function(err, data) {
        console.log(data);
        if (data && data.password === req.body.oldPwd) {
          User.findByIdAndUpdate(id, req.body, function(err, item) {
            json(res, err, item);
          });
        } else {
          res.send({
            error: -1,
            msg: '原密码错误鸟'
          });
        }
      });
    }
  }
}
