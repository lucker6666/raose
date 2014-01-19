var util = require('util');
module.exports = function(err, req, res, next) {
  if (!err) return next();
  // if validator is 'validator', only send the first error msg
  if(err.length && err[0].error && err[0].msg){
    return res.send(err[0]);
  }
  res.send({
    error:500,
    msg:util.inspect(err)
  });
};