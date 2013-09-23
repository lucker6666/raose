/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  app = express();
var flash = require('connect-flash');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/raose');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(express);
// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});
// 图片上传到uploads
app.use(express.bodyParser({
  uploadDir: './uploads'
}));
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('raosee'));

app.use(express.session({
  secret: 'secret',
  maxAge: new Date(Date.now() + 3600000),
  store: new MongoStore({
      db: mongoose.connection.db
    },
    function(err) {
      console.log(err || 'connect-mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  /* done(null, {
    username: username
  });*/
  User.findOne({
    username: username
  }, function(err, user) {
    done(err, user);
  });
});

var User = mongoose.model('user', {
  username: String,
  password: String
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      return done(null, user);
    });
  }
));

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// 登录检测
app.get('/api/usercheck', function(req, res) {
  if (!req.user) {
    res.send({
      error: 0,
      data: {
        hasSignin: false
      }
    });
  } else {
    res.send({
      error: 0,
      data: {
        hasSignin: true
      }
    });
  }

});
/**
 *-----------------------状态相关-------------------
 */

// 获取所有状态
app.get('/api/status', api.status.list);
// 获取单个状态
app.get('/api/status/:id', api.status.get);
// 更新单个状态
app.put('/api/status/:id', api.status.update);
// 添加单个状态
app.post('/api/status', api.status.add);
// 删除单个状态
app.delete('/api/status/:id', api.status.delete);

/**
 *-----------------------文档相关-------------------
 */
// 从Gist更新文档
app.get('/api/doc/_fetch',api.docs.fetchFromGist);
// 获取所有文档
app.get('/api/docs', api.docs.list);
// 获取单个文档
app.get('/api/doc/:id', api.docs.get);
// 更新单个文档
app.put('/api/doc/:id', api.docs.update);
// 添加单个文档
app.post('/api/docs', api.docs.add);
// 删除单个文档
app.delete('/api/doc/:id', api.docs.delete);


/**
 *-----------------------Issue相关-------------------
 */

// 获取所有状态
app.get('/api/issues', api.issues.list);
// 获取单个状态
app.get('/api/issue/:id', api.issues.get);
// 更新单个状态
app.put('/api/issues/:id', api.issues.update);
// 添加单个状态
app.post('/api/issues', api.issues.add);
// 删除单个状态
app.delete('/api/issues/:id', api.issues.delete);

/**
 *-----------------------todo相关---------------------
 */
app.get('/api/todos', api.todo.list);
app.post('/api/todos', api.todo.add);
app.get('/api/todo/:id', api.todo.get);

/**
 * ----------------------需求相关-------------------------
 */
app.get('/api/features', api.feature.list);
app.post('/api/features', api.feature.add);
app.get('/api/feature/:id', api.feature.get);
app.put('/api/feature/:id', api.feature.put);
app.delete('/api/feature/:id', api.feature.delete);

/**
 * ----------------------数据相关-------------------------
 */
app.get('/api/datas', api.data.list);
app.post('/api/datas', api.data.add);
app.get('/api/data/:id', api.data.get);
app.delete('/api/data/:id', api.data.delete);

/**
 * ----------------------讨论-------------------------
 */
// 相关到需求或者todo
// 讨论列表
app.get('/api/topics', api.topic.list);
// 讨论回复
app.get('/api/topic/:id/discussions', api.topic.getDiscussions);
app.post('/api/topic/:id/discussions', api.topic.addDiscussion);
// 讨论内容
app.get('/api/topic/:id', api.topic.get);
// 添加讨论
app.post('/api/topics', api.topic.add);
//app.put('/api/topic/:id', api.topic.update);
//app.delete('/api/topic/:id', api.topic.delete);

// 添加评论
//app.post('/api/topics/:id/discussions', api.topic.addDiscussion);
// 删除评论
//app.delete('/api/discussion/:id', api.discussion.delete);

//成员相关
// app.get('/api/members',api.members.list);
// 成员信息
// app.get('/api/members/:name',api.members.get);
// 所有话题 

app.get('/account/signin', function(req, res) {
  if (req.user) {
    res.redirect('back');
    return;
  }
  res.send('<form action="/account/signin" method="post">\
    <div>\
        <label>Username:</label>\
        <input type="text" name="username"/>\
    </div>\
    <div>\
        <label>Password:</label>\
        <input type="password" name="password"/>\
    </div>\
    <div>\
        <input type="submit" value="Log In"/>\
    </div>\
</form>');
});

app.get('/account/signup', function(req, res) {
  res.send('<form action="/account/signup" method="post">\
    <div>\
        <label>Username:</label>\
        <input type="text" name="username"/>\
    </div>\
    <div>\
        <label>Password:</label>\
        <input type="password" name="password"/>\
    </div>\
    <div>\
        <input type="submit" value="Sign up"/>\
    </div>\
</form>');
});

// 文档
// 关联到Gist 可以自动更新
app.post('/account/signin',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/account/fail',
    failureFlash: true
  })
);

// API 登录

app.post('/api/signin', function(req, res, next) {
  var rs = {
    error: 0,
    msg: '登录成功'
  }

  passport.authenticate('local', function(err, user, info) {
    req.login(user, function(err) {
      if (err) {
        rs = {
          erro: -1,
          msg: '登录失败'
        };
      }
      rs = {
        error: 0,
        msg: '登录成功' + req.user
      };
      res.send(rs);
      //res.redirect('/');
    });
  })(req, res, next);
});

app.post('/account/signup', function(req, res) {
  var one = new User(req.body);
  one.save(function(err, data) {
    console.log(err);
    res.send('注册成功鸟');
  });
});

app.get('/account/success', function(req, res) {
  res.send('success' + JSON.stringify(req.user));
});

app.get('/account/fail', function(req, res) {
  res.send('fail');
});

app.post('/api/sendmail', api.mail.sendmail);

app.get('/api/account/doActive', api.account.doActive);

// 图片上传接口
app.post('/api/upload', function(req, res) {
  var fs = require('fs');
  // get the temporary location of the file
  var tmp_path = req.files.file.path;
  var name = req.files.file.name;
  var ext = name.slice(name.lastIndexOf('.'));
  // set where the file should actually exists - in this case it is in the "images" directory
  var target_path = req.files.file.path + ext;
  // move the file from the temporary location to the intended location
  fs.rename(tmp_path, target_path, function(err) {
    if (err) throw err;
    // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
    fs.unlink(tmp_path, function() {
      if (err) throw err;
      res.send({
        error: 0,
        path: target_path
      });
    });
  });
});

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 *-----------------------------------用户相关--------------------*
 */
/*app.get('/members', api.members.list);
app.get('/account/settings', api.members.get);
app.post('/account/resetpwd', api.members.resetpwd);*/

// Start server
app.listen(8004, function() {
  console.log("Express server listening on port %d in %s mode", 8004, app.settings.env);
});