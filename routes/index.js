/*
 * GET home page.
 */
var staticDomain = require('../config/site.json').staticDomain;
exports.index = function(req, res) {
   if (!req.user && !/signin/.test(req.originalUrl)) {
        res.redirect('/account/signin');
        return;
    }
    

    res.render('index', {
        showWeeklyReport: true,
        user: req.user ? req.user : {
            username: 'null'
        },
        static:staticDomain
    });
};

exports.partials = function(req, res) {
    if (!req.user && req.params.name !== 'signin') {
        res.send('<div class="alert alert-danger">鉴权失败</div>');
        return;
    }
    var name = req.params.name;
    res.render('partials/' + name, {
        showWeeklyReport: true,
        user: req.user ? req.user : {
            username: 'null'
        },
        static:staticDomain
    });
};