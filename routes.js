var siteConfig = require("./config/site.json");
var User = require('./controllers/User');
var nodeExcel = require("excel-export");
function setup(app, passport) {
    // Routes
    var routes = require("./routes/index"), api = require("./routes/api");
    // Error handler
    app.use(require('./middlewares/error'));
    // token validator
    app.use(require('./middlewares/tokenValidator'));
    // auth handler
    app.use(require('./middlewares/auth'));
    app.get("/", routes.index);
    app.get("/partials/:name", routes.partials);
  
    // multipart handler
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart({ uploadDir: './public/uploads' });
    
    app.get('/api/*', require('./middlewares/CORS'));

    /**
     *-----------------------状态相关-------------------
     */
        // 获取所有状态
    app.get("/api/status", api.status.list);
    // 获取单个状态
    app.get("/api/status/:id", api.status.get);
    // 更新单个状态
    app.put("/api/status/:id", api.status.update);
    // 添加单个状态
    app.post("/api/status", api.status.add);
    // 删除单个状态
    app.delete("/api/status/:id", api.status.delete);
    /**
     *-----------------------文档相关-------------------
     */
        // 从Gist更新文档
    app.get("/api/doc/_fetch", api.docs.fetchFromGist);
    // 获取所有文档
    app.get("/api/docs", api.docs.list);
    // 获取单个文档
    app.get("/api/doc/:id", api.docs.get);
    // 更新单个文档
    app.put("/api/doc/:id", api.docs.update);
    // 添加单个文档
    app.post("/api/docs", api.docs.add);
    // 删除单个文档
    app.delete("/api/doc/:id", api.docs.delete);
    /**
     *-----------------------Issue相关-------------------
     */
        // issue 状态
    app.get("/api/issues/summary", api.issues.summary);
    // 获取所有状态
    app.get("/api/issues*", api.issues.list);
    // 获取单个状态
    app.get("/api/issue/:id/messages", api.issues.messages);
    app.get("/api/issue/:id/discussions", api.issues.getDiscussions);
    app.post("/api/issue/:id/discussions", api.issues.addDiscussion);
    app.get("/api/issue/:id", api.issues.get);
    // 更新单个状态
    app.put("/api/issue/:id", api.issues.update);
    // 添加单个状态
    app.post("/api/issues", api.issues.add);
    // 删除单个状态
    app.delete("/api/issue/:id", api.issues.delete);
    /**
     *-----------------------todo相关---------------------
     */
    app.get("/api/todos", api.todo.list);
    app.post("/api/todos", api.todo.add);
    app.get("/api/todo/:id/discussions", api.todo.getDiscussions);
    app.post("/api/todo/:id/discussions", api.todo.addDiscussion);
    app.get("/api/todo/:id", api.todo.get);
    app.put("/api/todo/:id", api.todo.put);
    app.delete("/api/todo/:id", api.todo.delete);

    /**
     * task
     * @todo
     *  GET     /task/:pid/feeds          the task action feeds
     *  GET     /task/:pid/subtasks       get subtask list
     *  POST    /task/:pid/subtasks       add a subtask
     *  DELETE  /task/:pid
     *  GET     /task/:pid/subtask/:id    get a specified subtask
     *  DELETE  /task/:pid/subtask/:id    delete a subtask
     *
     *  POST    /task/:pid/attachments   add an attachment
     *  POST    /task/:pid/docs          add a document
     */

    /**
     * Projects
     * GET     /projects                get all projects
     * POST    /projects                add a project
     *
     * GET     /project/:id             get a project
     * GET     /project/:id/followers   get followers of a project
     * GET     /project/:id/feeds       get action feeds
     * GET     /project/:id/tasks       get all tasks of a project
     * PUT     /project/:id             update a project
     * DELETE  /project/:id             delete a project
     * POST    /project/:id/attachments   add an attachments to a project
     *
     */

    /**
     * ----------------------需求相关-------------------------
     */
    app.get("/api/features", api.feature.list);
    app.post("/api/features", api.feature.add);
    app.get("/api/feature/:id", api.feature.get);
    app.put("/api/feature/:id", api.feature.put);
    app.delete("/api/feature/:id", api.feature.delete);
    /**
     * ----------------------数据相关-------------------------
     */
    app.get("/api/datas", api.data.list);
    app.post("/api/datas", api.data.add);
    app.get("/api/data/:id/followings", api.follow.getDataFollowings);
    app.get("/api/data/:id", api.data.get);
    app.delete("/api/data/:id", api.data.delete);
    app.put("/api/data/:id", api.data.put);
    /**
     *----------------------消息--------------------------
     */
    app.get("/api/me/messages", api.message.list);
    app.get("/api/me/todos", api.me.todos);
    app.get("/api/me/issues", api.me.issues);
    app.get("/api/me/profile", api.me.profile);
    app.put("/api/me/profile", api.me.updateProfile);
    app.put("/api/me/setAvatar", multipartMiddleware, api.me.setAvatar);
    app.get("/api/me/dataHistory", api.me.dataHistory);
    /**
     *----------------------文件--------------------------
     */
    /*   app.post('/api/files', api.file.add);
     app.get('/api/files', api.file.list);
     app.get('/api/file/:id', api.file.get);*/
    /**
     *----------------------Taxonomy--------------------------
     */
    app.post("/api/taxonomys", api.taxonomy.add);
    app.get("/api/taxonomys?*", api.taxonomy.list);
    /**
     *----------------------log--------------------------
     */
    app.get("/api/log/:type*", api.log.list);
    /**
     *------------------------track-------------------------
     */
    app.get("/api/_.gif", api.tracker.track);
    app.get("/api/track/_.gif", api.tracker.track_test);
    /**
     *----------------------deploy--------------------------
     */
    app.post("/api/secret/deploy", function (req, res) {
        var sys = require("sys"), exec = require("child_process").exec;
        var autoPull = require('./config/proxy.json')['Github_deploy'];

        if (autoPull) {
            console.log('[Deploy info] Github deploy option is closed'.green);
            return res.send('deploy stop done');
        }

        function puts(error, stdout, stderr) {
            api.log.add({
                type: "deploy",
                operator: null,
                details: {
                    git: JSON.parse(req.body.payload),
                    rs: stdout
                }
            }, function (err, item) {
                if (err) throw err;
                exec("grunt minJS");
                res.send({
                    error: 0,
                    data: stdout
                });
            });
        }

        exec("git pull github dev", puts);
    });
    /**
     *---------------------数据接口------------------------------
     */
    app.get("/api/iData/:name", function (req, res) {
        var type = req.params.name;
        var data = require("./cron/data/" + type + ".json");
        res.send(data);
    });
    /**
     * ----------------------讨论-------------------------
     */
        // 相关到需求或者todo
        // 讨论列表
    app.get("/api/topics", api.topic.list);
    // 讨论回复
    app.get("/api/topic/:id/discussions", api.topic.getDiscussions);
    app.post("/api/topic/:id/discussions", api.topic.addDiscussion);
    // 讨论内容
    app.get("/api/topic/:id", api.topic.get);
    // 添加讨论
    app.post("/api/topics", api.topic.add);
    //app.put('/api/topic/:id', api.topic.update);
    //app.delete('/api/topic/:id', api.topic.delete);
    // 添加评论
    //app.post('/api/topics/:id/discussions', api.topic.addDiscussion);
    // 删除评论
    //app.delete('/api/discussion/:id', api.discussion.delete);

    // 成员信息
    // app.get('/api/members/:name',api.members.get);
    // 所有话题 
    app.get("/account/:name", routes.index);
    app.get("/account/signup", function (req, res) {
        res.send('<form action="/account/signup" method="post">    <div>        <label>Username:</label>        <input type="text" name="username"/>    </div>    <div>        <label>Password:</label>        <input type="password" name="password"/>    </div>    <div>        <input type="submit" value="Sign up"/>    </div></form>');
    });
    app.post("/account/signin", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/account/fail",
        failureFlash: true
    }));
    app.post("/api/signin", function (req, res, next) {
        var rs = {
            error: 0,
            msg: "登录成功"
        };
        if (!req.body.username || !req.body.password) {
            res.send({
                error: -1,
                msg: "信息不完整哦"
            });
        }
        passport.authenticate("local", function (err, user, info) {
            if (err) {
                // add log
                api.log.add({
                    type: "signin",
                    operator: user.username,
                    details: {
                        post: req.body,
                        deal: rs,
                        ip: req.ip
                    }
                }, function (err, item) {
                    if (err) throw err;
                    res.send({
                        error: -1,
                        msg: "登录失败"
                    });
                });
                return;
            } else {
                req.login(user, function (err) {
                    if (err) {
                        rs = {
                            error: -1,
                            msg: "登录失败"
                        };
                    }
                    rs = {
                        error: 0,
                        msg: "登录成功"
                    };
                    // add log
                    api.log.add({
                        type: "signin",
                        operator: req.user._id ? req.user._id : null,
                        details: {
                            post: req.body,
                            deal: rs,
                            ip: req.ip
                        }
                    }, function (err, item) {
                        if (err) throw err;
                        res.send(rs);
                    });
                });
            }
        })(req, res, next);
    });
    app.post("/account/signup", function (req, res) {
        var one = new User(req.body);
        one.save(function (err, data) {
            console.log(err);
            res.send("注册成功鸟");
        });
    });
    app.get("/account/success", function (req, res) {
        res.send("success" + JSON.stringify(req.user));
    });
    app.get("/account/fail", function (req, res) {
        res.send("fail");
    });
    app.post("/api/sendmail", api.mail.sendmail);
    app.get("/api/account/doActive", api.account.doActive);

    app.post("/api/upload", multipartMiddleware, api.upload);
    var baiduAdapter = function (data) {
        var data = JSON.parse(data);
        var dates = data.data.items[0];
        var datas = data.data.items[1];
        var rs = {
            rows: []
        };
        dates.forEach(function (one, index) {
            rs["rows"].push([ dates[index][0], datas[index][0] === "--" ? 0 : datas[index][0] ]);
        });
        rs["rows"].reverse();
        return rs;
    };
    // 百度数据接口
    app.get("/api/baidu.json*", function (req, res) {
        var type = req.query.type;
        helper.Get("http://106.3.38.38:8888/api/baidu.json?type=" + type, function (data) {
            var data = baiduAdapter(data);
            res.send(data);
        });
    });
    // 数据接口
    // 使用美帝VPS做代理
    app.all("/api/ga.json*", function (req, res) {
        var http = require('http');
        var search = req.originalUrl.replace('/api/ga.json?', '');
        var proxyUrl = 'http://192.157.212.191:8888' + req.originalUrl;
        http.get(proxyUrl, function (res1) {
            var data = '';
            res1.on('data', function (chunk) {
                data += chunk;
            })
            res1.on('end', function () {
                if (data.length) {
                    res.send(JSON.parse(data));
                } else {
                    res.send({
                        error: 'has some problem'
                    });
                }
            })
        });
    });
    app.get("/excel/:site", function (req, res) {
        var site = req.params.site;
        var conf = {};
        conf.cols = [
            {
                caption: "日期",
                type: "string"
            },
            {
                caption: "浏览量",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "日均浏览量",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "访问次数",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "日均访问次数",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            }
        ];
        conf.rows = require("./cron/" + site + ".json");
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader("Content-Disposition", "attachment; filename=" + site + ".xlsx");
        res.end(result, "binary");
    });
    app.get("/api/excel/app", function (req, res) {
        //var site = req.params.site;
        // 获取全站数据
        var conf = {};
        conf.cols = [
            {
                caption: "日期",
                type: "string"
            },
            {
                caption: "新增用户",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "活跃用户",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "启动用户",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            }
        ];
        conf.rows = require("./cron/allapp_parse.json");
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader("Content-Disposition", "attachment; filename=" + "app.xlsx");
        res.end(result, "binary");
    });
    app.get("/api/excel/bbs", function (req, res) {
        //var site = req.params.site;
        // 获取全站数据
        var conf = {};
        conf.cols = [
            {
                caption: "日期",
                type: "string"
            },
            {
                caption: "全部来源",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "搜索引擎",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "直接访问",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "引荐来源",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            }
        ];
        conf.rows = require("./cron/allbbs_parse.json");
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader("Content-Disposition", "attachment; filename=" + "bbs_source.xlsx");
        res.end(result, "binary");
    });
    app.get("/api/excel/site", function (req, res) {
        //var site = req.params.site;
        // 获取全站数据
        var conf = {};
        conf.cols = [
            {
                caption: "日期",
                type: "string"
            },
            {
                caption: "全部发贴",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "WAP发贴",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "IOS发贴",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "Android发贴",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "WEB发贴",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "全部回复",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "Android回复",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "WAP回帖",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "IOS回贴",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "WEB回贴",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "日记",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "注册",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            },
            {
                caption: "登录",
                type: "number"
            },
            {
                caption: "日环比增长",
                type: "string"
            },
            {
                caption: "周均",
                type: "number"
            },
            {
                caption: "周环比增长",
                type: "string"
            }
        ];
        conf.rows = require("./cron/allsite_parse.json");
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader("Content-Disposition", "attachment; filename=" + "seedit.xlsx");
        res.end(result, "binary");
    });
    /**
     * follow
     */
    app.get("/api/follows*", api.follow.list);
    app.get("/api/follow/:id*", api.follow.get);
    app.delete("/api/follow/:id*", api.follow.delete);
    app.post("/api/follows", api.follow.restAdd);

    /**
     *  datastore
     */
    var validator = require('./middlewares/reqValidator').validateFilter;
    app.get("/api/datastore/export.json", validator(api.datastore.listSchema), api.datastore.list);
    app.post("/api/datastore*", api.datastore.add);


    app.get("/api/trackdata.json*", api.tracker.list);
    // still a TMP API
    app.get("/api/exports/crazy", function (req, res) {
        Crazy.find({}, function (err, data) {
            if (err) throw err;
            res.send({
                error: 0,
                data: data
            });
        });
    });
    // 数据池
    app.get("/api/datapools", api.datapool.set);
    app.get("/api/datapool", api.datapool.get);
    // signin
    app.post("/api/user/signin", api.user.loginUser);
    app.post("/api/user/check", api.user.checkUser);
    app.get("/api/user/profile", function (req, res) {
        if (!req.user) {
            res.send({
                error: 0,
                data: {
                    hasSignin: false
                }
            });
        } else {
            api.me.profile.call(this, req, res);
        }
    });
    // 登录检测
    app.get("/api/usercheck", function (req, res) {
        if (!req.user) {
            res.send({
                error: 0,
                data: {
                    hasSignin: false
                }
            });
        } else {
            api.me.profile.call(this, req, res);
        }
    });
    // calendar
    app.post("/api/calendars", api.calendar.add);
    app.get("/api/calendars", api.calendar.list);
    app.get("/api/calendar/:id", api.calendar.getSingle);
    app.put("/api/calendar/:id", api.calendar.update);
    // test ENV setup
    app.get("/api/test/setup", require("./routes/test.js").setup);
    // user info js
    app.get('/api/userinfo.js', function (req, res) {
        var userinfo;
        if (req.user) {
            userinfo = req.user;
        } else {
            userinfo = null;
        }
        res.set('Content-Type', 'application/javascript');
        res.send('var user=' + JSON.stringify(userinfo));
    });
    app.get('/api/sitestatus', require('./controllers/Site'));
    app.get('/api/test/timeout', require('./routes/test.js').timeout);

    // user
    app.get("/api/users", api.user.list);
    app.get('/api/user/search', api.user.searchUser);
    app.get("/api/user/:id?", api.user.get);

    // redirect all others to the index (HTML5 history)
    app.get("*", routes.index);
}

exports.setup = setup;