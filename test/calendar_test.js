var calendar = require('../controllers/Calendar');

exports['create'] = {
  setUp:function(done){
    done();
  },
    'created:fail':function(test){
      calendar.add({},function(err,data){
      console.log(err,data);
        test.done();
      });
    },
  'list':function(test){
    calendar.list({},function(err,data){
      console.log(err,data);
      test.done();
    });
  }
}