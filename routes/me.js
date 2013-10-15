var mongoose = require('mongoose');
// 帖子Model
var Todo = require('./todo.js').Model;
var Issues = require('./issue.js').Model;
exports.me = {
  todos: function(req, res) {
    Todo.find({
      owner: req.user.username
    }, function(err, data) {
      res.send({
        error: 0,
        data: data
      });
    })
  },
  issues: function(req, res) {
    Issues.find({
      owner: req.user.username
    }, function(err, data) {
      res.send({
        error: 0,
        data: data
      });
    });
  }
}