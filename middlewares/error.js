var util = require('util');
var code = require('../lib/error_code');
module.exports = function(err, req, res, next) {
  if (!err) return next();
  // if validator is 'validator', only send the first error msg
  if(err.length && err[0].error && err[0].msg){
    return res.send(err[0]);
  }
  // mongodb error
  if(/MongoError/.test(util.inspect(err))){
    return res.send({
        error:code['MONGODB_ERROR'][0],
        msg:code['MONGODB_ERROR'][1]
      });
  }
  // timeout error
  if(/Response timeout/.test(util.inspect(err))){
    return res.send({
      error:code['TIMEOUT'][0],
      msg:code['TIMEOUT'][1]
    });
  }
  // mongoose error
  // unknown error
  console.log('unknown error:'+err);
  res.send({
    error:500,
    msg:util.inspect(err)
  });
};