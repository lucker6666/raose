var User = require('../controllers/User');
module.exports = {
  setup:function(req,res,next){
    User.addUser({
      username:'airyland',
      realname:'李政',
      email:'airyland@qq.com',
      password:'123456'
    },function(err,item){
      console.log(err);
      if(err) return next(err);
      res.send({
        error:0,
        data:'account setup successfully'
      });
    });
  }
};
