var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('bucket',{
  // bucket name
  name:{
    type:String,
    required:true,
    unique:true
  },
  // last updated time
  last_updated_at:{
    type:Date,
    required:true
  },
  // the date range of bucket data
  date_range:{
    start:Date,
    end:Date
  }
});