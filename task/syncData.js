var http = require('restler');
var config = require('../config/proxy.json')
var proxy = config.proxy_ip;
var target = config.data_api;

// get site user visits
var format = function (date) {
    return [date.slice(0, 4), '/', date.slice(4, 6), '/', date.slice(6, 8)].join('');
};

http.get(proxy + '/api/ga.json?metrics=ga%3Avisits&end-date=2daysAgo&start-date=5daysAgo&dimensions=ga%3Adate&ids=ga%3A62079070&max-results=400')
    .on('complete', function (data) {
        var rows = data.rows;
        rows.forEach(function (one) {
            http.postJson(target, {
                bucket: 'All_visits',
                date: format(one[0]),
                data: one[1]}).on('complete', function (res) {
                    console.log(res);
                });
        });
        console.log(rows);
    });