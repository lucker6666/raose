/**
* Some API require Administrator Authorization
*/
module.exports = function(req, res, next){
  return next();
}