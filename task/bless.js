/**
 * 单任务
 * fetch 对象用以获取数据
 * parse 为数据分析函数
 * set 为数据保存函数
 * run 任务执行函数
 */
var helper = require('../lib/helper');
var task = {
    fetch: function () {

    },
    parse: function () {

    },
    set: function () {

    }
};

task.run = function () {
    var $5daysAgo = helper.getTimeByDay(5) / 1000;
    helper.Get('http://common.seedit.com/tools/bless.json?time=' + $5daysAgo + '&limit=2000000', function (data) {
        data = JSON.parse(data);
        getTrend(data.data.data);
    });
    var getTrend = function (data) {
        var dates = data.map(function (one) {
            return one.time.slice(0, 10);
        });
        var dates1 = data.filter(function (one) {
            return one.type === 1;
        }).map(function (one) {
                return one.time.slice(0, 10);
            });
        var dates2 = data.filter(function (one) {
            return one.type === 2;
        }).map(function (one) {
                return one.time.slice(0, 10);
            });
        var compress = helper.compressArray(dates, 'value');
        var compress1 = helper.compressArray(dates1, 'value');
        var compress2 = helper.compressArray(dates2, 'value');
        var querystring = require('querystring');
        compress.forEach(function (one, index) {
            var data = {
                type: 'bless',
                date: one.value,
                data: [one.count, compress1[index]['count'], compress2[index]['count']]
            };
            var url = 'http://106.3.38.38:8004/api/datastore?' + querystring.stringify(data);
            helper.Get(url, function (data) {
                console.log(data)
            });
        });
    };
};
module.exports = task.run;