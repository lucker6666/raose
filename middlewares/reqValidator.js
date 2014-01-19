var code = require('../lib/error_code');
/* Validation middleware for routes. */
var validator = require('validator');
var validate = function(params, schema, callback) {
    var errors = [];
    for (var i in schema) {
        var one = schema[i];
        // check require
        if (one.required === true) {
            if (!params[i]) {
              errors.push({error:code['ARG_MISSED'][0],msg:'missing arg:'+ i});
            }
        }
        // check type
        if (one.type && params[i]) {
            if (!validator[one.type](params[i])) {
              errors.push({error:code['ARG_WRONG_TYPE'][0],msg:'arg type not match:'+ i});
            }
        }
    }
    callback(errors.length ? errors : null, {});
};

module.exports = {
    validate: validate,
    validateBody: function(schema) {
        return function(req, res, next) {
            validate(req.body, schema, function(err, validObj) {
                return next(err);
            }, 'body');
        };
    },
    validateQuery: function(schema) {
        return function(req, res, next) {
            validate(req.query, schema, function(err, validObj) {
                // req.query = validObj;
                return next({
                    validator: 'validator',
                    err: err
                });
            }, 'query');
        };

    },
    validateFilter: function(schema) {
        return function(req, res, next) {
             var filters = require('querystring').parse(req.query.filters);
              validate(filters, schema, function(err, validObj) {
                  if(!err) return next();
                  return next(err);
              }, 'filters');
        };

    }
};