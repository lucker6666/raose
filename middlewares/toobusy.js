/**
* referred to: https://github.com/lloyd/node-toobusy
* @todo add test
* @todo add config
*/
var code = require('../lib/error_code');
var toobusy = require('toobusy');
module.exports = function(req, res, next) {
  if (toobusy()) {
    res.send({error:code['OVER_CAPACITY'][0], msg:code['OVER_CAPACITY'][1]});
  } else {
    next();
  } 
};