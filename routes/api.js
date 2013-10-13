var mongoose = require('mongoose');

/*var Project = mongoose.model('Project', {
  name: String
});

var seedit = new Project({
  name: 'Zildjian'
});
seedit.save(function(err) {
  if (err) {} // ...
  console.log('meow');
});

Project.find({}, function(err, data) {
  console.log(data);
});*/

var error = {
  innerError: {
    error: -1,
    msg: '内部错误'
  }
};
// 状态
var Status = mongoose.model('Status', {
  name: String,
  desc: String
});

// 站内消息
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

// 数据源
var Data = mongoose.model('Data', {
  name: String,
  type: String, //数据类型，ga || umeng || seedit,
  chartType: String, // 图表类型
  option: mongoose.Schema.Types.Mixed // 选项为复杂类型
});

// todo 

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

var User = mongoose.model('User', {
  username: String,
  password: String,
  flag: {
    type: Number,
    default: 0
  }
});

exports.user = {
  list: function(req, res) {
    User.find({}, 'username flag', function(err, data) {
      res.send({
        error: 0,
        data: data
      });
    });
  }
}
// issue 
var Issues = mongoose.model('Issue', {
  // 用户
  author: String,
  title: String,
  // 指派给
  owner: String,
  // 影响范围
  site: String,
  // URL 
  url: String,
  content: String,
  // 来源
  from: String,
  // 提交人
  submit: String,
  // 影响范围
  area: String,
  // 时间
  date: {
    type: Date,
    default: Date.now
  },
  // 标签
  labels: String,
  // 优先级
  level: Number
});

// 帖子Model

var Topic = mongoose.model('Topic', {
  title: String, // 标题
  date: { // 日期
    type: Date,
    default: Date.now
  },
  content: String, // 内容
  author: String, // 作者
  mention: Array, // 提到的人
  related: {
    type: Number, // 关联到需求或者待办
    id: Number // 需求或者待办的id
  }
});

// 文档Model
var Doc = mongoose.model('Doc', {
  title: String,
  author: String,
  useGist: {
    type: Boolean,
    default: false
  },
  rawUrl: String,
  date: {
    type: Date,
    default: Date.now
  },
  content: String
});

// 需求Model
// 为需求添加文档
var Feature = mongoose.model('Feature', {
  author: String,
  date: {
    type: Date,
    default: Date.now
  },
  title: String,
  content: String
});

exports.me = {
  todos: function(req, res) {
    Todo.find({
      owner: req.user.username
    }, function(err, data) {
      res.send({
        error: 0,
        data: data
      });
    })
  },
  issues: function(req, res) {
    Issues.find({
      owner: req.user.username
    }, function(err, data) {
      res.send({
        error: 0,
        data: data
      });
    });
  }
}

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
    //Feature.findByIdAndUpdate();
  }
};

/*  add: function(req, res) {

  },
  list: function(req, res) {

  },
  get: function(req, res) {

  },
  delete: function(req, res) {

  },
  put: function(req, res) {

  }*/

// GET

exports.posts = function(req, res) {
  var posts = [];
  data.posts.forEach(function(post, i) {
    posts.push({
      id: i,
      title: post.title,
      text: post.text.substr(0, 50) + '...'
    });
  });
  res.json({
    posts: posts
  });
};

exports.post = function(req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }
};

// POST

exports.addPost = function(req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

// PUT

exports.editPost = function(req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

// DELETE

exports.deletePost = function(req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};

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

exports.issues = {
  add: function(req, res) {
    req.body.author = req.user.username;
    var issue = new Issues(req.body);
    issue.save(function(err, rs) {
      if (err) {
        res.send({
          erro: -1,
          msg: err
        });
        return;
      }
      res.send({
        error: 0,
        msg: '添加成功',
        data: rs
      });
    });
  },

  delete: function(req, res) {
    var id = req.params.id;
    Issues.findByIdAndRemove(id, function(err) {
      if (err === null) {
        res.send({
          error: 0,
          msg: '删除成功'
        })
      } else {
        res.send(error.innerError);
      }
    });
  },
  update: function(req, res) {
    delete req.body._id;
    Issues.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err === null) {
        res.send({
          error: 0,
          msg: '更新成功'
        })
      } else {
        res.send({
          error: -1,
          msg: err
        })
      }
    })
  },

  list: function(req, res) {
    Issues.find({}, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      })
    })
  },

  get: function(req, res) {
    Issues.findById(req.params.id, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      });
    })
  },
};

// 讨论模型
var Discussion = mongoose.model('Discussion', {
  type: String, // 类型
  typeId: String, // 相关id,如讨论id,需求id
  author: String,
  date: {
    type: Date,
    default: Date.now
  },
  content: String
});

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
    })
  },
  // 删除单个回复
  // @todo 作权限检测 
  removeDisussion: function(req, res) {
    var discussionId = req.params.id;
    Discussion.findByIdAndRemove(id, function(err) {
      if (err) throw err;
      res.send({
        erro: 0,
        msg: '删除成功'
      })
    })
  }
}

exports.todo = {
  // 添加
  add: function(req, res) {
    req.body.author = req.user.username;
    // 无指派时为自己
    if (!req.body.owner) {
      req.body.owner = req.user.username;
    }
    var todo = new Todo(req.body);
    todo.save(function(err) {
      if (err) console.log('保存todo出错鸟');
      console.log('todo保存成功');
    });
    res.json(req.body);
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

exports.docs = {
  fetchFromGist: function(req, res) {
    Doc.find({
      useGist: true
    }, function(err, data) {
      data.forEach(function(one) {
        var https = require('https');
        https.get(one.rawUrl, function(rs) {
          var data = '';
          rs.on('data', function(chunk) {
            data += chunk;
          });
          rs.on('end', function() {
            Doc.update({
              _id: one._id
            }, {
              content: data
            }, function(err) {
              console.log(err);
              res.send({
                error: 0,
                msg: '获取成功'
              })
            })
          });
        });
      });
      //res.send(data);
    });
  },
  add: function(req, res) {
    req.body.author = req.user.username;
    var doc = new Doc(req.body);
    doc.save(function(err) {
      if (err) throw err;
      res.send({
        error: 0,
        msg: '添加成功'
      });
    });
  },
  list: function(req, res) {
    Doc.find({}, function(err, data) {
      if (err) throw err;
      res.send({
        error: 0,
        data: data
      })
    })
  },
  delete: function(req, res) {
    Doc.findByIdAndRemove(req.params.id, function(err) {
      if (err) throw err;
      res.send({
        error: 0,
        msg: '删除成功'
      });
    })
  },
  // 更新文档
  update: function(req, res) {
    var body = req.body;
    delete(body._id);
    Doc.findByIdAndUpdate(req.params.id, body, function(err, data) {
      res.send({
        error: 0,
        data: data
      });
    });
    // 更新文档
  },
  // 获取单条
  get: function(req, res) {
    Doc.findById(req.params.id, function(err, data) {
      if (err) throw err;
      //if (data.useGist === true) {
      if (req.query.raw !== '1') {
        var md = require("node-markdown").Markdown;
        data.content = md(data.content);
      }
      //}
      res.send({
        error: 0,
        data: data
      });
    })
  }
}

// 用户模型
var ActiveUser = mongoose.model('activeUser', {
  // 邮箱
  email: String,
  // 激活信息
  activeInfo: {
    // 发送邮件时间
    sendTime: {
      type: Date,
      default: Date.now
    },
    // 激活时间
    activeTime: {
      type: Date,
      default: Date.now
    },
    // 是否已经激活
    hasActived: {
      type: Boolean,
      default: false
    },
    activeHash: String
  }
});

var generateHash = function(string) {
  return require('crypto').createHash('md5').update(string).digest("hex");
};

exports.account = {
  // 激活
  doActive: function(req, res) {
    var activeHash = req.query.hash;
    ActiveUser
      .where('activeInfo.hasActived')
      .equals(false)
      .where('activeInfo.activeHash')
      .equals(activeHash)
      .exec(function(err, data) {
        console.log(arguments);
        if (err) {
          res.send({
            erro: -2,
            msg: '查找出错了'
          });
          return;
        }
        // 存在
        if (data.length) {
          // 未激活
          // 更新状态为激活

          // 更新激活时间 
          ActiveUser.update({
            _id: data[0]._id
          }, {
            activeInfo: {
              sendTime: data[0].activeInfo.sendTime,
              hasActived: true,
              activeTime: new Date
            }
          }, function(err) {
            if (err) {
              res.send({
                error: 4,
                msg: '抱歉，激活失败鸟' + err
              });
              return;
            } else {
              res.send({
                error: 0,
                msg: '激活成功鸟'
              })
            }
          })

        } else {
          res.send({
            error: 5,
            msg: '亲，激活链接无效哦'
          });
        }
      });
  }
}
exports.mail = {
  sendmail: function(req, res) {
    var email = req.body.email;
    if (!/@bozhong.com/.test(email)) {
      res.send({
        error: 1,
        msg: '抱歉，不是播种网邮箱'
      });
      return;
    }

    ActiveUser.find({
      email: email
    }, function(err, data) {
      if (data.length) {
        console.log(data);
        res.send({
          error: 2,
          msg: '已经发送过邮箱激活邮件啦'
        });
      } else {
        // 没有发送过
        var nodemailer = require('nodemailer');
        // 生成激活hash
        var activeHash = generateHash(email);
        var user = new ActiveUser({
          email: email,
          activeInfo: {
            activeHash: activeHash
          }
        });

        // Create a SMTP transport object
        var transport = nodemailer.createTransport("SMTP", {
          auth: {
            user: "airyland@qq.com",
            pass: "qqlizhengnjxt"
          }
        });

        // Message object
        var message = {
          // sender info
          from: '播种网产品工具 <airyland@qq.com>',
          // Comma separated list of recipients
          to: '"Receiver Name" <' + email + '>',
          // Subject of the message
          subject: 'Nodemailer is unicode friendly ✔', //
          headers: {
            'X-Laziness-level': 1000
          },
          // plaintext body
          text: 'Hello to myself!',
          // HTML body
          html: '激活链接：<a href="http://172.16.5.108:8004/api/account/doActive?hash=' + activeHash + '">点此激活</a>'
        };
        transport.sendMail(message, function(error) {
          if (error) {
            console.log('Error occured');
            console.log(error.message);
            res.send({
              error: 1,
              msg: '发送错误'
            })
            return;
          }
          user.save(function(err) {
            res.send({
              error: 0,
              msg: '激活邮件发送成功'
            });
          });
          // if you don't want to use this transport object anymore, uncomment following line
          transport.close(); // close the connection pool
        });

      }
    })

  }
}

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
    data.save(function(err) {
      if (err) throw err;
      res.send({
        error: 0,
        msg: '保存成功'
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