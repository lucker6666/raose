/**
 * Created by lizheng on 13-12-26.
 */
var cronJob = require('cron').CronJob;
var tasks = function () {
    require('./baidu')();
};
tasks();
new cronJob('1 * * * * *', function () {
    console.log('每分钟执行一次', new Date());
    //require('./bless')();
    tasks();
}, null, true, "Asia/Hong_Kong");

