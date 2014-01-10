var siteConfig = require("./config/site.json");
function setup(app, passport) {
    var mongoose = require("./lib/mongoose");
    // Routes
    var routes = require("./routes/index"), api = require("./routes/api");
    // Error handler
    app.use(function(err, req, res, next) {
        if (!err) return next();
        // you also need this line
        console.log(err,typeof err);
        res.send({
            error: 1001,
            msg: err
        });
    });
    app.get("/", routes.index);
    app.get("/partials/:name", routes.partials);
    // API接口的登录验证
    app.get("/api/*", function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        // the track api do not requrie authentication
        var excludeAuth = function() {
            var list = siteConfig.auth.exclude;
            for (var i = 0; i < list.length; i++) {
                if (req.originalUrl.indexOf(list[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }();
        if (excludeAuth) {
            return next();
        }
        if (req.body && !req.user && !req.body.username && !req.body.password && !req.query.token) {
            return next("auth fail");
        }
        next();
    });
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
    app.put("/api/me/setAvatar", api.me.setAvatar);
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
    app.post("/api/secret/deploy", function(req, res) {
        var sys = require("sys"), exec = require("child_process").exec;
        function puts(error, stdout, stderr) {
            api.log.add({
                type: "deploy",
                operator: null,
                details: {
                    git: JSON.parse(req.body.payload),
                    rs: stdout
                }
            }, function(err, item) {
                if (err) throw err;
                exec("grunt minJS");
                res.send({
                    error: 0,
                    data: stdout
                });
            });
        }
        exec("git pull github master", puts);
    });
    /**
     *---------------------数据接口------------------------------
     */
    app.get("/api/iData/:name", function(req, res) {
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
    //成员相关
    app.get("/api/users", api.user.list);
    app.get("/api/user/:id?", api.user.get);
    // 成员信息
    // app.get('/api/members/:name',api.members.get);
    // 所有话题 
    app.get("/account/signin", function(req, res) {
        if (req.user) {
            res.redirect("back");
            return;
        }
        res.render("index", {
            user: {
                username: null,
                flag: 1
            }
        });
    });
    app.get("/account/signup", function(req, res) {
        res.send('<form action="/account/signup" method="post">    <div>        <label>Username:</label>        <input type="text" name="username"/>    </div>    <div>        <label>Password:</label>        <input type="password" name="password"/>    </div>    <div>        <input type="submit" value="Sign up"/>    </div></form>');
    });
    app.post("/account/signin", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/account/fail",
        failureFlash: true
    }));
    app.post("/api/signin", function(req, res, next) {
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
        passport.authenticate("local", function(err, user, info) {
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
                }, function(err, item) {
                    if (err) throw err;
                    res.send({
                        error: -1,
                        msg: "登录失败"
                    });
                });
                return;
            } else {
                req.login(user, function(err) {
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
                    }, function(err, item) {
                        if (err) throw err;
                        res.send(rs);
                    });
                });
            }
        })(req, res, next);
    });
    app.post("/account/signup", function(req, res) {
        var one = new User(req.body);
        one.save(function(err, data) {
            console.log(err);
            res.send("注册成功鸟");
        });
    });
    app.get("/account/success", function(req, res) {
        res.send("success" + JSON.stringify(req.user));
    });
    app.get("/account/fail", function(req, res) {
        res.send("fail");
    });
    app.post("/api/sendmail", api.mail.sendmail);
    app.get("/api/account/doActive", api.account.doActive);
    // 图片上传接口
    app.post("/api/upload", function(req, res) {
        var fs = require("fs");
        var target_path = null;
        // get the temporary location of the file
        var tmp_path = req.files.file.path;
        console.log(tmp_path);
        var name = req.files.file.name;
        var ext = name.slice(name.lastIndexOf("."));
        // set where the file should actually exists - in this case it is in the "images" directory
        target_path = req.files.file.path + ext;
        // move the file from the temporary location to the intended location
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            res.send({
                error: 0,
                data: {
                    ext: ext.slice(1),
                    path: req.files.file.path.split("/")[2],
                    name: req.files.file.name,
                    date: new Date(),
                    author: req.user.username
                }
            });
        });
    });
    var baiduAdapter = function(data) {
        var data = JSON.parse(data);
        var dates = data.data.items[0];
        var datas = data.data.items[1];
        var rs = {
            rows: []
        };
        dates.forEach(function(one, index) {
            rs["rows"].push([ dates[index][0], datas[index][0] === "--" ? 0 : datas[index][0] ]);
        });
        rs["rows"].reverse();
        return rs;
    };
    // 百度数据接口
    app.get("/api/baidu.json*", function(req, res) {
        var type = req.query.type;
        helper.Get("http://106.3.38.38:8888/api/baidu.json?type=" + type, function(data) {
            var data = baiduAdapter(data);
            res.send(data);
        });
    });
    // 数据接口
    // 使用美帝VPS做代理
    app.post("/api/ga.json", function(req, res) {
        var user = req.body;
        if (!user.username || !user.password) {
            res.send({
                error: -2,
                msg: "鉴权信息不完整"
            });
            return;
        }
        User.findOne(req.body, function(err, user) {
            if (user) {
                var search = req.originalUrl.replace("/api/ga.json?", ""), proxyUrl = "http://173.208.199.49:8888" + req.originalUrl, http = require("http");
                http.get(proxyUrl, function(res1) {
                    var data = "";
                    res1.on("data", function(chunk) {
                        data += chunk;
                    });
                    res1.on("error", function(err) {
                        console.log(err);
                    });
                    res1.on("end", function() {
                        if (data.length) {
                            // add log
                            api.log.add({
                                type: "getData",
                                operator: req.user && req.user.uid ? req.user.uid : "null",
                                details: {
                                    filters: req.query.filters
                                }
                            }, function(err, item) {
                                if (err) throw err;
                                res.send(JSON.parse(data));
                            });
                        } else {
                            res.send({
                                error: "has some problem"
                            });
                        }
                    });
                });
            } else {
                res.send({
                    error: -1,
                    msg: "登录失败了"
                });
            }
        });
    });
    app.get("/excel/:site", function(req, res) {
        var site = req.params.site;
        var conf = {};
        conf.cols = [ {
            caption: "日期",
            type: "string"
        }, {
            caption: "浏览量",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "日均浏览量",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "访问次数",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "日均访问次数",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        } ];
        conf.rows = require("./cron/" + site + ".json");
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader("Content-Disposition", "attachment; filename=" + site + ".xlsx");
        res.end(result, "binary");
    });
    app.get("/api/excel/app", function(req, res) {
        //var site = req.params.site;
        // 获取全站数据
        var conf = {};
        conf.cols = [ {
            caption: "日期",
            type: "string"
        }, {
            caption: "新增用户",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "活跃用户",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "启动用户",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        } ];
        conf.rows = require("./cron/allapp_parse.json");
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader("Content-Disposition", "attachment; filename=" + "app.xlsx");
        res.end(result, "binary");
    });
    app.get("/api/excel/bbs", function(req, res) {
        //var site = req.params.site;
        // 获取全站数据
        var conf = {};
        conf.cols = [ {
            caption: "日期",
            type: "string"
        }, {
            caption: "全部来源",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "搜索引擎",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "直接访问",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "引荐来源",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        } ];
        conf.rows = require("./cron/allbbs_parse.json");
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader("Content-Disposition", "attachment; filename=" + "bbs_source.xlsx");
        res.end(result, "binary");
    });
    app.get("/api/excel/site", function(req, res) {
        //var site = req.params.site;
        // 获取全站数据
        var conf = {};
        conf.cols = [ {
            caption: "日期",
            type: "string"
        }, {
            caption: "全部发贴",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "WAP发贴",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "IOS发贴",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "Android发贴",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "WEB发贴",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "全部回复",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "Android回复",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "WAP回帖",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "IOS回贴",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "WEB回贴",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "日记",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "注册",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        }, {
            caption: "登录",
            type: "number"
        }, {
            caption: "日环比增长",
            type: "string"
        }, {
            caption: "周均",
            type: "number"
        }, {
            caption: "周环比增长",
            type: "string"
        } ];
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
    app.get("/api/datastore/export", api.datas.list);
    app.get("/api/datastore*", api.datas.add);
    app.get("/api/trackdata.json*", api.tracker.list);
    // 疯狂造人API
    var Crazy = mongoose.model("crazy", {
        date: {
            type: Date,
            "default": Date.now
        },
        data: Object
    });
    app.get("/api/crazy", function(req, res) {
        var data = req.query;
        var callback = req.query.__c;
        var crazy = new Crazy({
            data: data
        });
        crazy.save(function(err, item) {
            if (err) {
                res.send(callback + "({error_code:-1,msg:'没有成功哦'})");
            } else {
                res.send(callback + "({error_code:0,msg:'成功了哦'})");
            }
        });
    });
    // still a TMP API
    app.get("/api/exports/crazy", function(req, res) {
        Crazy.find({}, function(err, data) {
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
    app.get("/api/user/profile", function(req, res) {
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
    app.get("/api/usercheck", function(req, res) {
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
    // test ENV setup
    app.get("/api/test/setup", require("./routes/test.js").setup);
    // redirect all others to the index (HTML5 history)
    app.get("*", routes.index);
}

exports.setup = setup;