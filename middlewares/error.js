var util = require('util');
var code = require('../lib/error_code');
function mongooseErrorHandler(err) {
    //If it isn't a mongoose-validation error, just throw it.
    var messages = {
        'required': "%s can't be blank.",
        'format': "%s must be at least 3 characters.",
        'unique': "%s is already in use.",
        'email': "%s is invalid",
        'min': "%s below minimum.",
        'max': "%s above maximum.",
        'enum': "%s not an allowed value."
    };

    //A validationerror can contain more than one error.
    var errors = [];

    //Loop over the errors object of the Validation Error
    Object.keys(err.errors).forEach(function (field) {
        var eObj = err.errors[field];

        //If we don't have a message for `type`, just push the error through
        if (!messages.hasOwnProperty(eObj.type)) errors.push(eObj.type);

        //Otherwise, use util.format to format the message, and passing the path
        else errors.push(require('util').format(messages[eObj.type], eObj.path));
    });

    return errors;
}
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
  
  if(/ValidationError/.test(util.inspect(err))){
    return res.send({
      error:5555,
      msg:mongooseErrorHandler(err)
    });
    
    }
    

  // mongoose error
  // unknown error
  console.log('unknown error:'+err);
  res.send({
    error:500,
    err: err.stack,
    msg:util.inspect(err)
  });
};