/**
* referred to: https://github.com/lloyd/node-toobusy
* @todo add test
* @todo add config
*/
var toobusy = require('toobusy');
module.exports = function(req, res, next) {
  if (toobusy()) {
    res.send({error:503, msg:"I'm busy right now, sorry."});
  } else {
    next();
  } 
};