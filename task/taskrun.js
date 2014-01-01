/**
 * Created by lizheng on 13-12-26.
 */
var cronJob = require('cron').CronJob;
var tasks = function () {
    require('./bless')();
    require('./baidu')();
};
tasks();
new cronJob('5 * * * * *', function () {
    console.log('每5分钟执行一次', new Date());
    tasks();
    tasks();
}, null, true, "Asia/Hong_Kong");

