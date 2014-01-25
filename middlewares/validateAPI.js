/**
 * used to validate if an API is provided
 */
var APIs = ['issue', 'file', 'user'];
module.exports = function(req, res, next) {
    var cat = req.originalUrl.split('?')[0].slice(1).split('/')[0];
    if (APIs.indexOf(cat) === -1) {
        return next({
            error: 4003,
            msg: 'do not support this API'
        });
    }
    return next();
};