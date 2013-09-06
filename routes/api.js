var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/raose');

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

// 状态
var Status = mongoose.model('Status', {
  name: String,
  desc: String
});

// todo 

var Todo = mongoose.model('Todo', {
  title: String,
  date: {
    type: Date,
    default: Date.now
  },
  cat: String
});

/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"
var data = {
  "posts": [{
    "title": "Lorem ipsum",
    "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }, {
    "title": "Sed egestas",
    "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
  }]
};

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
      res.json(data);
    })
  }
};

exports.todo = {
  // 添加
  add: function(req, res) {
    var todo = new Todo(req.body);
    todo.save(function(err) {
      if (err) console.log('保存todo出错鸟');
      console.log('todo保存成功');
    });
    res.json(req.body);
  },
  // 列表
  list: function(req, res) {
    Todo.find({}, function(err, data) {
      res.json(data);
    })
  }
};

exports.feature = {
  // 废弃
  addPost: function(req, res) {
    console.log(req.body);
    data.posts.push(req.body);
    res.json(req.body);
  },
  // 添加需求
  add: function(req, res) {

  },
  // 删除，实际上是归档隐藏
  remove: function() {

  },
  // 更新
  update: function() {

  },
  // 取得列表
  list: function() {

  }
};