var User = require('../controllers/User');
module.exports =   function(req,res,next){
     if(req.query.token){
       User.checkToken(req.query.token,function(err,token){
         if(err){
           return next(err);
         }
         if(!token){
           return res.send({
             error:1004,
             msg:'invalid token'
           });
         }
         return next();
       });
     }
    return next();
  };