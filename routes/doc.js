var mongoose = require('mongoose');
// Doc model
var Doc = mongoose.model('Doc', {
  title: String,
  author: String,
  useGist: {
    type: Boolean,
    default: false
  },
  // when has a rawURl, cannot be edited
  rawUrl: String,
  // time
  date: {
    type: Date,
    default: Date.now
  },
  // raw content
  content: {
    type: String,
    default: ''
  },
  // last updator info
  lastUpdate: {
    date: Date,
    user: String
  },
  // when true, seen by all members
  open: {
    type: Boolean,
    default: true
  },
  // when true, can be edited by all members
  editable_by_other: {
    type: Boolean,
    default: true
  }
});

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
              });
            })
          });
        });
      });
    });
  },
  add: function(req, res) {
    req.body.author = req.user.username;
    req.body.lastUpdate = {
      date: Date.now(),
      user: req.user.username
    };
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
    // list the open:true docs and docs by the curren user
    Doc.find({
        $or: [{
          open: true
        }, {
          author: req.user.username
        }]
      }, '-content',{sort:{date:-1}},
      function(err, data) {
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
    // 添加更新时间
    body.lastUpdate = {
      date: Date.now(),
      user: req.user.username
    };
    console.log(body);
    Doc.findByIdAndUpdate(req.params.id, body, function(err, data) {
      if (err) {
        res.send({
          error: 1,
          msg: err
        });
      }
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
      if (req.query.raw !== '1') {
        var md = require("node-markdown").Markdown;
        data.content = data.content ? md(data.content) : data.content;
      }
      res.send({
        error: 0,
        data: data
      });
    })
  }
};
