var mongoose = require('mongoose'),
    Calendar = require('../controllers/Calendar');

module.exports = {
  add : function(req,res,next){
    req.body.created_by = req.user.uid;
    Calendar.add(req.body,function(err,data){
      if(err) {
        return next(err);
      }
      res.send({
        error:0,
        data:data
      });
    });
  },
  list : function(req,res,next){
    Calendar.list({},function(err,data){
      if(err) {
        return next(err);
      }
      res.send({
        error:0,
        data:data
      });
    });
  },
  getSingle : function(req,res,next){
    Calendar.getSingle(req.params.id,function(err,item){
      if(err) {
        return next(err);
      }
      res.send({
        error:0,
        data:item
      });
    });
  },
  update:function(req,res,next){
   delete req.body._id;
    Calendar.update(req.params.id,req.body,function(err,data){
      if(err) return next(err);
      res.send({error:0,data:data});
    });
  }
};