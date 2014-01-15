var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;
var Topic = mongoose.model('Topic', {
  title: {
    type: String,
    required: true
  }, // 标题
  date: { // 日期
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true
  }, // 内容
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }, // 作者
  mention: Array, // 提到的人
  related: {
    type: Number, // 关联到需求或者待办
    id: Number // 需求或者待办的id
  }
});
