var baiduAdapter = function (raw) {
    console.log('raw', raw);
    // 生成x轴
    var categories = raw.items[0].map(function (one) {
        return one[0]//.slice(5); // 去除前面的年份
    });

    //categories = categories.reverse();
    //console.log(categories.reverse());
    // 生成y系列
    var series = [];
    raw.fields.splice(0, 1);
    raw.fields.forEach(function (one, index) {
        var oneData = raw.items[1].map(function (item1, index1) {
            return item1[index] === '--' ? 0 : item1[index];
        });
        var oneSeries = {
            name: one,
            data: oneData
        };
        series.push(oneSeries);
    });

    // 去除不必要的series,奇葩的百度统计API
    series = series.filter(function (one) {
        // 去除跳出率什么,平均访问时间
        return one.name !== 'ratio_pv_count' && one.name !== 'ratio_visitor_count' && one.name !== 'bounce_ratio' && one.name !== 'avg_visit_pages' && one.name !== 'avg_visit_time';
    });

    return {
        categories: categories,
        series: series
    };
};

socket.on('got_data', function (data) {
    console.log('got data', data);
    var metas = data.meta.split('$$');
    var target = metas[0];
    var chartType = metas[1];
    var title = metas[2];
    var raw = JSON.parse(data.data);
    // console.log('raw', raw);
    var parseData = baiduAdapter(raw.data);
    console.log(parseData);
    $(target).createChart({
        chart: {
            type: chartType
        },
        title: {
            text: 'hello world'
        },
        // chart: {type: 'column'},
        xAxis: {
            categories: parseData.categories
        },
        series: parseData.series
    });
});
var $now = +new Date;
var $start = +new Date('2013-12-14');
/**
 * meta参数用$$分隔 目标选择器$$图表类型$$标题
 */



var MiaoCtrl = function ($scope, $http) {

    setTimeout(function () {
        socket.emit('need_data_request', {
            meta: '#from_cm$$line$$QQ群推广流量',
            url: 'http://tongji.baidu.com/web/2569732/ajax/post',
            data: 'flag=visit_landingpage&siteId=3846977&area=&source=&visitor=&pageId=5426213238567859767&st=1386950400000&et=' + $now + '&order=simple_date_title%2Casc&offset=0&indicators=out_pv_count%2Cbounce_ratio%2Cavg_visit_time%2Cavg_visit_pages&gran=5&clientDevice=&reportId=31&method=trend%2Fhistory%2Fa&queryId='
        });

        socket.emit('need_data_request', {
            meta: '#from_wb$$line$$微博推广流量',
            url: 'http://tongji.baidu.com/web/2569732/ajax/post',
            data: 'flag=visit_landingpage&siteId=3846977&area=&source=&visitor=&pageId=6327123066172119156&st=1386950400000&et=' + $now + '&order=simple_date_title%2Casc&offset=0&indicators=out_pv_count%2Cbounce_ratio%2Cavg_visit_time%2Cavg_visit_pages&gran=5&clientDevice=&reportId=31&method=trend%2Fhistory%2Fa&queryId='
        });

        var getPageView = function (meta, siteId, pageId) {
            socket.emit('need_data_request', {
                meta: meta,
                url: 'http://tongji.baidu.com/web/2569732/ajax/post',
                data: 'flag=visit_landingpage&siteId=2984237&area=&source=&visitor=&pageId=18056781361689672957&st=1386950400000&et=' + $now + '&order=simple_date_title%2Casc&offset=0&indicators=out_pv_count%2Cbounce_ratio%2Cavg_visit_time%2Cavg_visit_pages&gran=5&clientDevice=&reportId=31&method=trend%2Fhistory%2Fa&queryId='
            });
        };


        socket.emit('need_data_request', {
            meta: '#from_wx$$line$$微信',
            url: 'http://tongji.baidu.com/web/2569732/ajax/post',
            data: 'flag=visit_landingpage&siteId=2984237&area=&source=&visitor=&pageId=18056781361689672957&st=1386950400000&et=' + $now + '&order=simple_date_title%2Casc&offset=0&indicators=out_pv_count%2Cbounce_ratio%2Cavg_visit_time%2Cavg_visit_pages&gran=5&clientDevice=&reportId=31&method=trend%2Fhistory%2Fa&queryId='
        });

        socket.emit('need_data_request', {
            meta: '#from_wap$$line$$WAP站广告图',
            url: 'http://tongji.baidu.com/web/2569732/ajax/post',
            data: 'flag=visit_landingpage&siteId=2984237&area=&source=&visitor=&pageId=9032971018561725340&st=1386950400000&et=' + $now + '&order=simple_date_title%2Casc&offset=0&indicators=out_pv_count%2Cbounce_ratio%2Cavg_visit_time%2Cavg_visit_pages&gran=5&clientDevice=&reportId=31&method=trend%2Fhistory%2Fa&queryId='
        });

        socket.emit('need_data_request', {
            meta: '#page-views$$areaspline$$浏览量',
            url: 'http://tongji.baidu.com/web/2569732/ajax/post',
            data: 'siteId=3846977&clientDevice=all&st=1386864000000&et=' + $now + '&indicators=pv_count%2Cvisitor_count&gran=5&flag=month&reportId=3&method=trend%2Ftime%2Ff&queryId='
        });

    }, 100);

    // 入口页面 'siteId=3846977&st=1385222400000&et=1387728000000&indicators=out_pv_count%2Cvisitor_count%2Cip_count&flag=pv&order=out_pv_count%2Cdesc&offset=0&pageSize=50&reportId=15&method=visit%2Flandingpage%2Fa&queryId='

    $.get('http://106.3.38.38:8004/api/datastore/export?filters=type%3Dbless&start-date=2013-12-12&end-date=2013-12-29').success(function (data) {
        var dataSource = (function () {
            return data.rows.map(function (one) {
                return {
                    date: one[0].slice(-5),
                    all: one[1] - 0,
                    make: one[2] - 0,
                    back: one[3] - 0
                }
            });
        })();

        var categoris = data.rows.map(function (one) {
            return one[0];
        });

        var series = [
            {
                name: '全部愿望',
                data: data.rows.map(function (one) {
                    return one[1] - 0;
                })
            },
            {
                name: '许愿',
                data: data.rows.map(function (one) {
                    return one[2] - 0;
                })
            },
            {
                name: '还愿',
                data: data.rows.map(function (one) {
                    return one[3] - 0;
                })
            }
        ];

        $("#chartContainer").createChart({chart: {type: 'areaspline'}, xAxis: { categories: categoris}, series: series});

        // 上香数

        $("#xiang").dxChart({
            dataSource: [
                {
                    date: '2012-12-13',
                    count: 2000,
                    click: 3048
                },
                {
                    date: '2013-12-14',
                    count: 1407,
                    click: 2261
                },
                {
                    date: '2013-12-15',
                    count: 1254,
                    click: 2200
                },
                {
                    date: '2013-12-16',
                    count: 1474,
                    click: 2346
                },
                {
                    date: '2013-12-17',
                    count: 1461
                },
                {
                    date: '2013-12-18',
                    count: 822
                }
            ],
            commonSeriesSettings: {
                //type: "spline",
                argumentField: "date"
            },
            series: [
                {
                    valueField: "count",
                    name: "上香人数"
                },
                {
                    valueField: "click",
                    name: "点击上香人数"
                }
            ],
            argumentAxis: {
                grid: {
                    visible: true
                }
            },
            tooltip: {
                enabled: true
            },
            title: "上香次数",
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            },
            commonPaneSettings: {
                border: {
                    visible: true,
                    right: false
                }
            }
        });


        $("#gongde").dxChart({
            dataSource: [
                {
                    date: '2013-12-14',
                    count: 375,
                    click: 234
                },
                {
                    date: '2013-12-15',
                    count: 316,
                    click: 156
                },
                {
                    date: '2013-12-16',
                    count: 346,
                    click: 170
                },
                {
                    date: '2013-12-17',
                    count: 346,
                    click: 170
                },
                {
                    date: '2013-12-18',
                    count: 218
                }
            ],
            commonSeriesSettings: {
                //  type: "splineArea",
                argumentField: "date"
            },
            series: [
                {
                    valueField: "count",
                    name: "捐功德次数"
                },
                {
                    valueField: "click",
                    name: "点击捐功德次数"
                }
            ],
            argumentAxis: {
                grid: {
                    visible: true
                }
            },
            tooltip: {
                enabled: true
            },
            title: "捐功德次数",
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            },
            commonPaneSettings: {
                border: {
                    visible: true,
                    right: false
                }
            }
        });

        var views = [

            {
                date: '2013-12-13',
                pv: 6831,
                uv: 4808
            },
            {
                date: '2013-12-14',
                pv: 5259,
                uv: 4047
            },
            {
                date: '2013-12-15',
                pv: 4638,
                uv: 3545
            },
            {
                date: '2013-12-16',
                pv: 5095,
                uv: 4020
            },
            {
                date: '2013-12-17',
                pv: 5056,
                uv: 3924
            },
            {
                date: '2013-12-18',
                pv: 2532,
                uv: 1952
            }

        ];

        $http.get('/api/datapool?name=miaoFrom').success(function (data) {
            var categories = data.data.data.map(function (one) {
                return one[0];
            });

            var pv = data.data.data.map(function (one) {
                return one[1];
            });

            var uv = data.data.data.map(function (one) {
                return one[2];
            });

            $('#pie').createChart({
                chart: {
                    type: 'bar'
                },
                xAxis: {
                    categories: categories
                },
                series: [
                    {
                        dataLabels: {
                            enabled: true
                        },
                        name: 'UV',
                        data: uv
                    } ,
                    {
                        dataLabels: {
                            enabled: true
                        },
                        name: 'PV',
                        data: pv
                    }
                ]
            });
        });


        $http.get('http://192.157.212.191:8888/api/ga.json?ids=ga%3A63911100&dimensions=ga%3Adate&metrics=ga%3AtotalEvents&filters=ga%3AeventCategory%3D%3D%E9%80%81%E5%AD%90%E7%81%B5%E5%BA%99%3Bga%3AeventAction%3D%3D%E5%BC%80%E5%A7%8B%E4%B8%8A%E9%A6%99&max-results=100&start-date=2013-12-12&end-date=2013-12-23').success(function (data) {
            // console.log(data);
            var options = {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: data.rows.map(function (one) {
                        return one[0].slice(4)
                    })
                },
                series: [
                    {
                        name: '点击',
                        data: data.rows.map(function (one) {
                            return one[1] - 0
                        })
                    } ,
                    {
                        name: '上香成功',
                        data: [0, 0, 2000, 1407, 1254, 1474, 1461, 1471, 1506, 1489, 1095, 1043, 668]
                    }
                ]
            };
            $('#xiang').highcharts(options);
        });

        var gongdeUrl = 'http://192.157.212.191:8888/api/ga.json?ids=ga%3A63911100&dimensions=ga%3Adate&metrics=ga%3AtotalEvents&filters=ga%3AeventCategory%3D%3D%E9%80%81%E5%AD%90%E7%81%B5%E5%BA%99%3Bga%3AeventAction%3D%3D%E6%8D%90%E5%8A%9F%E5%BE%B7&max-results=100&start-date=2013-12-12&end-date=2013-12-23';

        $http.get(gongdeUrl).success(function (data) {
            console.log(data);
            var options = {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: data.rows.map(function (one) {
                        return one[0].slice(4)
                    })
                },
                series: [
                    {
                        name: '点击',
                        data: data.rows.map(function (one) {
                            return one[1] - 0
                        })
                    } ,
                    {
                        name: '捐功德成功',
                        data: [0, 0, 234, 156, 170, 170, 356, 351, 305, 243, 218, 150]
                    }
                ]
            };
            console.log(options);
            $('#gongde').highcharts(options);
        });

    });


};