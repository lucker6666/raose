// load site config
var siteConfig = require("./config/site.json"),
    socket = require("socket.io"),
    helper = require("./lib/helper.js"),
    passport = require("passport"), 
    LocalStrategy = require("passport-local").Strategy;

var express = require("express"), 
    routes = require("./routes"), 
    api = require("./routes/api"), 
    app = express(),
    flash = require("connect-flash");

// logger
 var expressWinston = require('express-winston'),
     winston = require('winston'); // for transports.Console

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
    app.set("view options", {
        layout: false,
        pretty: true
    });
    app.use(express.errorHandler({
        showStack: true,
        dumpExceptions: true
    }));
    // custom header
    app.use(function(req, res, next) {
        app.disable("x-powered-by");
        res.setHeader("X-Powered-By", "Raose:Team Collaboration Tool");
        next();
    });
  
    // body parser
    app.use(express.json());
    app.use(express.urlencoded());
    
    // timeout
    app.use(express.timeout(5000));
  
    app.use(express.methodOverride());
    app.use(express.static(__dirname + "/public"));
    app.use(express.cookieParser(siteConfig.cookieSecre));
    app.use(express.session({
        secret: "secret",
        maxAge: new Date(Date.now() + 36e5),
        store: new MongoStore({
            db: "raose",
            auto_reconnect: true
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
  
    // enable view cache in product ENV
    app.configure('product',function(){
      app.set('view cache', 'true');
    });
    
    // dev ENV config
    app.configure('dev',function(){
      // express-winston logger makes sense BEFORE the router.
      app.use(expressWinston.logger({
        transports: [
          new winston.transports.Console({
            json: true,
            colorize: true
          })
        ]
      }));
    });
    
    app.use(app.router);
});

function start(port,done) {
    require("./routes").setup(app, passport);
    if(typeof port ==='undefined'){
      port = 8004;
    }
    var server = app.listen(port, function() {
        console.log("Express server listening on port %d in %s mode", port, app.settings.env);
        done && done();
    });
  
    var io = require('./lib/socketServer').listen(server)

    return server;
}

exports.start = start;
exports.app = app;