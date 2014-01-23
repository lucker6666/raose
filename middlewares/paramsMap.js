/**
 * conver [n]daysAgo to a date
 */
var moment = require('moment');
var reg = /\d+daysAgo/;
module.exports = function (req, res, next) {
    var query = req.query;
    for (var one in query) {
        var item = query[one];
        if (reg.test(item)) {
            var date = moment().subtract('days', item.replace('daysAgo', '')).format("YYYY-MM-DD");
            query[one] = item.replace(reg, date);
        }
    }
    return next();
};


