var mongoose = require('../lib/mongoose');
var Topic = mongoose.model('Topic', {
  title: String, // 标题
  date: { // 日期
    type: Date,
    default: Date.now
  },
  content: String, // 内容
  author: String, // 作者
  mention: Array, // 提到的人
  related: {
    type: Number, // 关联到需求或者待办
    id: Number // 需求或者待办的id
  }
});