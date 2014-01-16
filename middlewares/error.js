module.exports = function(err, req, res, next) {
  if (!err) return next();
  res.send({
    error: 500,
    msg: err
  });
};