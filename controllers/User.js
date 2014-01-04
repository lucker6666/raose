var User = require('../models/user.js');

module.exports = {
    /**
     * find user by username and password
     */
    findUser: function(username, password, callback) {
        User.findOne({
            username: username,
            password: password
        }).exec(function(err, item) {
            callback(err, item);
        });
    },
    addUser: function(data, callback) {
        var user = new User(data);
        user.save(function(err, item) {
            callback && callback(err, item);
        });
        //@todo email notify option
    }
};