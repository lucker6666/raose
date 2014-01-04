var jwt = require('jwt-simple');
module.exports = {
    encode: function(payload, secret) {
        return jwt.encode(payload, secret);
    },
    decode: function(token, secret) {
        return jwt.decode(token,secret);
    }
};