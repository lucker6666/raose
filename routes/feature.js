/**
 * 需求
 * 需求可加成员，成员可看数据，成员可以看到需求动态，其他人可以关注需求进展
 */
var mongoose = require('mongoose');
// 为需求添加文档
var Feature = require('../models/Feature');

exports.feature = {
    add: function (req, res, next) {
        req.body.author = req.user.username;
        var feature = new Feature(req.body);
        feature.save(function (err) {
            if (err) {
                return next(err);
            }
            return res.send({
                error: 0,
                msg: '添加成功'
            });
        });
    },
    list: function (req, res, next) {
        // query except content and files
        Feature.find({}, '-content -files', {
            sort: {
                date: -1
            }
        }, function (err, data) {
            if (err) {
                return next(err);
            }
            return res.send({
                error: 0,
                data: data
            })
        })
    },
    get: function (req, res, next) {
        var id = req.params.id;
        Feature.findById(id, function (err, data) {
            if (err) {
                return next(err);
            }
            return res.send({
                error: 0,
                data: data
            });
        });
    },
    delete: function (req, res, next) {
        var id = req.params.id;
        Feature.findByIdAndRemove(id, function (err) {
            if (err) {
                return next(err);
            }
            res.send({
                error: 0,
                msg: '删除成功'
            });
        })
    },
    put: function (req, res, next) {
        var id = req.params.id;
        delete req.body._id;
        Feature.findByIdAndUpdate(id, req.body, function (err, item) {
            if (err) {
                return next(err);
            }
            return res.send({
                error: 0,
                data: item
            });
        });
    }
};