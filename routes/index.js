/*
 * GET home page.
 */

exports.index = function(req, res) {
    if (!req.user) {
        res.redirect('/account/signin');
        return;
    }
    // var isAdmin = (req.user.flag === 0) ? 'show' : 'hid';
    // console.log(req.user, isAdmin, req.user.flag, typeof req.user.flag, req.user.flag === 0);
    res.render('index', {
        showWeeklyReport: true,
        user: req.user ? req.user : {
            username: 'null'
        }
    });
};

exports.partials = function(req, res) {
    if (!req.user && req.params.name !== 'signin') {
        res.send('<div class="alert alert-danger">鉴权失败</div>');
        return;
    }
    var name = req.params.name;
    // var isAdmin = (req.user.flag === 0) ? 'show' : 'hid';
    // console.log(req.user, isAdmin, req.user.flag, typeof req.user.flag, req.user.flag === 0);
    res.render('partials/' + name, {
        showWeeklyReport: true,
        user: req.user ? req.user : {
            username: 'null'
        }
    });
};