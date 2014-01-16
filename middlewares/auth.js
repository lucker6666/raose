var siteConfig = require("../config/site.json");
module.exports = function(req, res, next) {
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
      
        return next();
    };