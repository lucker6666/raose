// load site config
var siteConfig = require("./config/site.json");

var socket = require("socket.io");

var nodeExcel = require("excel-export");

var helper = require("./lib/helper.js");

var passport = require("passport"), LocalStrategy = require("passport-local").Strategy;

var express = require("express"), routes = require("./routes"), api = require("./routes/api"), app = express();

var flash = require("connect-flash");

var mongoose = require("./lib/mongoose");

var User = require("./models/user");

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({
        username: username,
        password: password
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done("signin fail", false, {
                message: "Incorrect username."
            });
        }
        return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    User.findOne({
        username: user.username
    }, "_id username flag", function(err, user) {
        done(err, {
            username: user.username,
            uid: user._id
        });
    });
});

var MongoStore = require("connect-mongo")(express);

// Configuration
app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    //app.set('view cache', 'true');
    app.set("view options", {
        layout: false
    });
    // custom header
    app.use(function(req, res, next) {
        app.disable("x-powered-by");
        res.setHeader("X-Powered-By", "Raose:Team Collaboration Tool");
        next();
    });
    // 图片上传到uploads
    app.use(express.bodyParser({
        uploadDir: "./public/uploads"
    }));
    app.use(express.methodOverride());
    app.use(express.static(__dirname + "/public"));
    app.use(express.cookieParser("raosee"));
    app.use(express.session({
        secret: "secret",
        maxAge: new Date(Date.now() + 3600000),
        store: new MongoStore({
            db: "raose",
            auto_reconnect: true
        }, function(err) {
            if (err) console.log("mongodb setup fail");
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(app.router);
});

function start() {
    require("./routes").setup(app, passport);
    var server = app.listen(8004, function() {
        console.log("Express server listening on port %d in %s mode", 8004, app.settings.env);
    });
    var io = socket.listen(server);
}

exports.start = start;

exports.app = app;