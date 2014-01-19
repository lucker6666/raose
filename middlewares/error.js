var util = require('util');
module.exports = function(err, req, res, next) {
  if (!err) return next();
  if(err.validator === 'validator'){
    return res.send({
      error: 1002,
      msg: err
    });
  }
  res.send({
    error:1002,
    msg:util.inspect(err)
  });
};