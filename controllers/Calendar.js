var Calendar = require('../models/Calendar');
module.exports = {
  add: function(data,callback){
    new Calendar(data).save(function(err,item){
      callback && callback(err,item);
    });
  },
  list:function(filter,callback){
    filter = filter || {};
    Calendar.find(filter).exec(function(err,datas){
      callback && callback(err,datas);
    });
  },
  getSingle:function(id,callback){
    Calendar.findById(id).exec(function(err,item){
      callback && callback(err,item);
    });
  },
  update:function(id,data,callback){
    Calendar.findByIdAndUpdate(id,data,function(err,data){
      callback && callback(err,data);
    });
  }
};