module.exports = {
    json: function(res, err, data) {
        if (err) {
            res.send({
                error: 1,
                msg: err
            });
        } else {
            res.send({
                error: 0,
                data: data
            });
        }
    }
}