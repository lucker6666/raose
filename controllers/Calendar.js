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
  }
};