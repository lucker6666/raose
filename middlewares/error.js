var util = require('util');
module.exports = function(err, req, res, next) {
  if (!err) return next();
  res.send({
    error:1002,
    msg:util.inspect(err)
  });
};