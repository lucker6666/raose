var mongoose = require('mongoose');
var Message = mongoose.model('Message', {
  // 日期
  date: {
    type: Date,
    default: Date.now
  },
  // 发送方
  from: {
    type: String,
    default: '系统'
  },
  // 接收方
  to: String,
  // 是否已读
  read: {
    type: Boolean,
    default: false
  },
  //消息内容
  content: {
    // 添加了数据源
    action: String,
    // BBS流量来源
    target: String,
    // 链接
    link: String
  }
});

exports.message = {
  add: function(req, res) {

  },
  list: function(req, res) {
    if (!req.user) {
      res.send({
        error: -1,
        msg: 'not logined yet'
      });
      return;
    }
    Message.find({
      to: req.user.username
    }, function(err, data) {
      res.send({
        error: 0,
        data: data
      })
    })
  }
};

exports.MessageModel = {
  add: function(data, callback) {
    var message = new Message(data);
    message.save(function(err, item) {
      callback.call(this, err, item);
    });
  }
};