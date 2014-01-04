var kue = require('kue'),
    jobs = kue.createQueue();

module.exports = {
    createJob: function(option) {
        jobs.create('email',option).save();
    },
    process: function() {

    }
};