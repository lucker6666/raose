var socket = require('socket.io-client')
io = socket.connect('http://106.3.38.38:8888/data');
var helper = require('../lib/helper');
var querystring = require('querystring');
var no = 0;
var exit = function () {
    no++;
    if (no === 2)  process.exit(code = 0)
};
module.exports = function () {

    var handlers = {
        miaoFrom: function (data) {
            data = JSON.parse(data.data);
            data = data.data;
            console.log(data);
            var rs = [];
            data.items[0].forEach(function (one, index) {
                rs.push([one[0].name.replace('http://www.seedit.com/tools/songzimiao.htm?from=', '').replace('http://www.seedit.com/tools/songzimiao.htm?', '').replace('http://www.seedit.com/tools/songzimiao.htm', '直接'), data.items[1][index][0], data.items[1][index][1]]);
            });
            helper.Get('http://106.3.38.38:8004/api/datapools?name=miaoFrom&data=' + encodeURIComponent(JSON.stringify(rs)), function (data) {
                console.log(data);
                exit(no);
            });
        },
        userAttr: function (data) {
            // console.log('处理用户属性');
            // console.log(data);
        },
        baiduIndex: function (data) {
            console.log('处理百度索引');
            console.log(data);
            var rs = [];
            data = JSON.parse(data.data);
            console.log(data);
            data.data.items[0].forEach(function (one, index) {
                rs.push([one[0], data.data.items[1][index][0], data.data.items[1][index][1]]);
            });
            rs = rs.reverse();
            console.log(JSON.stringify(rs));
            helper.Get('http://106.3.38.38:8004/api/datapools?name=index&data=' + encodeURIComponent(JSON.stringify(rs)), function (data) {
                console.log(data);
                exit(no);
            });

        }
    };
    var $this = this;
    io.on('connect', function () {
        console.log('connected');
        io.on('disconnect', function () {
            console.log('disconnected');
        });
        io.on('fetcher_log', function (data) {
            console.log(data);
        });
        io.on('got_data', function (data) {
            handlers[data['meta']](data);
        });
        var $now = +new Date;
        var $1monthAgo = $now - 30 * 24 * 3600 * 1000;
        var $2monthAgo = $now - 60 * 24 * 3600 * 1000;
        io.emit('need_data_request', {
            meta: 'userAttr',
            url: 'http://tongji.baidu.com/web/2569732/ajax/post',
            data: 'siteId=2887950&st=1372564086000&et=' + $now + '&reportId=19&method=visit%2Fattribute%2Ff&queryId='
        });

        io.emit('need_data_request', {
            meta: 'baiduIndex',
            url: 'http://tongji.baidu.com/web/2569732/ajax/post',
            data: 'siteId=2887950&order=&st=' + $2monthAgo + '&et=' + $now + '&offset=0&st2=&et2=&reportId=28&method=opt%2Findexes%2Fa&queryId='
        });

        io.emit('need_data_request', {
            meta: 'miaoFrom',
            url: 'http://tongji.baidu.com/web/2569732/ajax/post',
            data: 'siteId=3846977&st=' + (+new Date('2013-12-10')) + '&et=' + $now + '&st2=&et2=&indicators=out_pv_count%2Cvisitor_count%2Cip_count&flag=pv&order=out_pv_count%2Cdesc&offset=0&reportId=15&method=visit%2Flandingpage%2Fa&queryId='
        });

    });
};

