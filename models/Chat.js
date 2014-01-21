var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var chatSchema = mongoose.model('chat',{
  created_at:{
    type: Date,
    default: Date.now
  },
  created_by:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  group:String
});

module.exports = chatSchema;
