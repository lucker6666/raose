var User = require('../controllers/User');
module.exports = {
  setup:function(req,res,next){
    User.addUser({
      username:'airyland',
      realname:'李政',
      email:'airyland@qq.com',
      password:'123456'
    },function(err,item){
      if(err) return next(err);
      res.send({
        error:0,
        data:'account setup successfully'
      });
    });
  },
  timeout: function(req,res){
    setTimeout(function(){
            res.end('hello world\n');
        },10000);
  } 
};
