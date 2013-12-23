var baiduAdapter = function (raw) {
    console.log('raw', raw);
    // 生成x轴
    var categories = raw.items[0].map(function (one) {
        return one[0].slice(5); // 去除前面的年份
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




var ApplyCtrl = function ($scope, $http) {
    $.get('http://106.3.38.38:8004/api/datastore/export?filters=type%3Dapply&start-date=2013-11-01&end-date=2013-12-29').success(function (data) {
        $scope.numbers = [];
        var dataSource = (function () {
            return data.rows.map(function (one) {
                return {
                    date: one[0].slice(5),
                    count: one[1] - 0
                }
            });
        })();


        $("#numbers").dxChart({
            dataSource: dataSource,
            commonSeriesSettings: {
                type: "splineArea",
                argumentField: "date"
            },
            series: [
                {
                    valueField: "count",
                    name: "申请人数"
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
            title: "申请人数",
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

        var numbers = (function () {
            return data.rows.map(function (one) {
                return [one[0].slice(5), one[1]];
            })
        })();
        $scope.applys = numbers;
    });
};

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


        var from = [
            {
                name: 'flash',
                val: 1924
            },
            {
                name: '顶部导航',
                val: 1090
            },
            {
                name: 'BBS顶部通栏',
                val: 725
            },
            {
                name: '焦点图',
                val: 488
            },
            {
                name: 'BBS宣传帖子',
                val: 319
            },
            {
                name: '直接访问',
                val: 199
            },
            {
                name: 'BBS换量位',
                val: 112
            },
            {
                name: '孕育百宝箱',
                val: 41
            },
            {
                name: '主导航',
                val: 41
            },
            {
                name: 'QQ群',
                val: 25
            },
            {
                name: 'WWW首屏通栏',
                val: 23
            },
            {
                name: 'BBS顶部通栏',
                val: 19
            },
            {
                name: '帐号中心',
                val: 21
            },
            {
                name: '新浪微博推广',
                val: 14
            },
            {
                name: '帐号中心',
                val: 21
            }
        ];


        $("#from").dxPieChart({
            dataSource: from,
            title: "流量来源",
            tooltip: {
                enabled: true,
                // format:"millions",
                percentPrecision: 2,
                customizeText: function () {
                    return this.valueText + " - " + this.percentText;
                }
            },
            legend: {
                horizontalAlignment: "center",
                verticalAlignment: "bottom",
                margin: 0
            },
            series: [
                {
                    type: "doughnut",
                    argumentField: "name",
                    label: {
                        visible: true,
                        font: {
                            size: 16
                        },
                        connector: {
                            visible: true,
                            width: 0.5
                        },
                        position: "columns",
                        customizeText: function (arg) {
                            return arg.valueText + " ( " + arg.percentText + ")";
                        }
                    }
                }
            ]
        });

        $http.get('http://173.208.199.49:8888/api/ga.json?ids=ga%3A63911100&dimensions=ga%3Adate&metrics=ga%3AtotalEvents&filters=ga%3AeventCategory%3D%3D%E9%80%81%E5%AD%90%E7%81%B5%E5%BA%99%3Bga%3AeventAction%3D%3D%E5%BC%80%E5%A7%8B%E4%B8%8A%E9%A6%99&max-results=100&start-date=2013-12-12&end-date=2013-12-23').success(function (data) {
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
            // console.log(options);
            $('#xiang').highcharts(options);
        });

        var gongdeUrl = 'http://173.208.199.49:8888/api/ga.json?ids=ga%3A63911100&dimensions=ga%3Adate&metrics=ga%3AtotalEvents&filters=ga%3AeventCategory%3D%3D%E9%80%81%E5%AD%90%E7%81%B5%E5%BA%99%3Bga%3AeventAction%3D%3D%E6%8D%90%E5%8A%9F%E5%BE%B7&max-results=100&start-date=2013-12-12&end-date=2013-12-23';

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


        var pie = [
            ["http://www.seedit.com/tools/songzimiao.htm?from=flash", 29255],
            ["http://www.seedit.com/tools/songzimiao.htm?from=common_ad", 7017],
            ["http://www.seedit.com/tools/songzimiao.htm", 4380],
            ["http://www.seedit.com/tools/songzimiao.htm?from=top_ad", 3345],
            ["http://www.seedit.com/tools/songzimiao.htm?from=bbs", 2408],
            ["http://www.seedit.com/tools/songzimiao.htm?from=focus_ad", 1837],
            ["http://www.seedit.com/tools/songzimiao.htm?from=exchange", 1016],
            ["http://www.seedit.com/tools/songzimiao.htm?from=www_1screen_ad", 391],
            ["http://www.seedit.com/tools/songzimiao.htm?bzref_la=rj", 294],
            ["http://www.seedit.com/tools/songzimiao.htm?from=bbs_nav_top_ad", 305],
            ["http://www.seedit.com/tools/songzimiao.htm?from=nav", 197],
            ["http://www.seedit.com/tools/songzimiao.htm?from=%E4%B8%BB%E5%AF%BC%E8%88%AA", 181],
            ["http://www.seedit.com/tools/songzimiao.htm?bbs_topic_ad", 210],
            ["http://www.seedit.com/tools/songzimiao.htm?bzref_la=cm", 75],
            ["http://www.seedit.com/tools/songzimiao.htm?from=主导航", 84],
            ["http://www.seedit.com/tools/songzimiao.htm?bzref_la=rj~~", 55],
            ["http://www.seedit.com/tools/songzimiao.htm?from=account_bozhong", 73],
            ["http://www.seedit.com/tools/songzimiao.htm?from=account_thirdpart", 50],
            ["http://www.seedit.com/tools/songzimiao.htm?from=weibo", 26],
            ["http://www.seedit.com/tools/songzimiao.htm?from=www_tools", 20],
            ["http://a.seedit.cn/admin/cms/preview/preview/type/page/id/52a55f35a3c3b15d42000004", 1],
            ["http://www.seedit.com/tools/songzimiao.htm?from=", 13],
            ["http://www.seedit.com", 11],
            ["http://www.seedit.com/tools/songzimiao.htm?", 6],
            ["http://riji.seedit.com", 2],
            ["http://www.seedit.com/tools/songzimiao.htm?from=top_line", 5],
            ["http://www.hao123.com/?tn=99563495_hao_pg", 5],
            ["http://www.hao123.com/?tn=91392420_hao_pg", 3],
            ["http://bbs.seedit.com/forum-24-1.html", 1],
            ["http://riji.seedit.com/home.php?mod=spacecp&ac=mylabel&op=base", 1],
            ["http://www.seedit.com/tools/songzimiao.htm?from=%EF%BF%BD%EF%BF%BD%EF%BF%BD", 3],
            ["http://common.seedit.com/cms/content.html?type=page&id=52a55f35a3c3b15d42000004", 1],
            ["http://bbs.seedit.com/forum-1928-1.html", 2],
            ["http://m.baidu.com/redirect.jsp?from=tc&bd_page_type=1&ssid=0&uid=0&pu=osna…a1aa1604d7bdcea5b0a403b5c&read=0&url=http://bbs.seedit.com/forum-24-1.html", 1],
            ["http://bbs.seedit.com", 2],
            ["http://bbs.seedit.com/index.php", 1],
            ["http://www.seedit.com/tools/songzimiao.htm?mqq_source=iphoneqq&bzref_la=cm", 1],
            ["http://www.hao123.com/?tn=92182484_hao_pg", 2],
            ["http://www.seedit.com/tools/songzimiao.htm?a6fe68eb04a41cb4feed03322998c1ed=6506f8bd4df0f05bb26378d5bb9bcc93", 1],
            ["http://bbs.seedit.com/thread-36959725-1-1.html", 1],
            ["http://bbs.seedit.com/thread-36604878-1-1.html", 1],
            ["http://bbs.seedit.com/thread-3593132-1-1.html", 1],
            ["http://www.seedit.com/tools/songzimiao.htm?from=focus_ad?08d6b4a061280063d3e9b68aab81318c=0d060525aa05d0d123f601f537042c4f", 1],
            ["http://bbs.seedit.com/thread-1216084-1-1.html", 1],
            ["http://bbs.seedit.com/forum.php?mod=viewthread&tid=210801&extra=&ordertype=1&page=1", 1],
            ["http://www.seedit.com/tools/songzimiao.htm?from=涓诲鑸?", 1],
            ["http://bbs.seedit.com/thread-37435471-7-1.html", 1],
            ["http://m.seedit.com/forum.php?mod=viewthread&tid=3661919&mobile=no", 1],
            ["http://bbs.seedit.com/thread-153602-1-1.html", 1],
            ["http://bbs.seedit.com/forum.php?mod=viewthread&tid=37291363&reltid=37392729&pre_pos=5&ext=", 1]
        ];
        $('#pie').createChart({
            /* chart: {
             plotBackgroundColor: null,
             plotBorderWidth: null,
             plotShadow: false
             },
             title: {
             text: 'Browser market shares at a specific website, 2010'
             },
             tooltip: {
             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
             },
             plotOptions: {
             pie: {
             allowPointSelect: true,
             cursor: 'pointer',
             dataLabels: {
             enabled: true,
             color: '#000000',
             connectorColor: '#000000',
             format: '<b>{point.name}</b>: {point.percentage:.1f} %'
             }
             }
             },*/
            chart: {
                type: 'bar'
            },
            xAxis: {
                // categories: ["http://www.seedit.coms/tools/songzimiao.htm?from=flash", "http://www.seedit.com/tools/songzimiao.htm?from=common_ad", "http://www.seedit.com/tools/songzimiao.htm", "http://www.seedit.com/tools/songzimiao.htm?from=top_ad", "http://www.seedit.com/tools/songzimiao.htm?from=bbs", "http://www.seedit.com/tools/songzimiao.htm?from=focus_ad", "http://www.seedit.com/tools/songzimiao.htm?from=exchange", "http://www.seedit.com/tools/songzimiao.htm?from=www_1screen_ad", "http://www.seedit.com/tools/songzimiao.htm?bzref_la=rj", "http://www.seedit.com/tools/songzimiao.htm?from=bbs_nav_top_ad", "http://www.seedit.com/tools/songzimiao.htm?from=nav", "http://www.seedit.com/tools/songzimiao.htm?from=%E4%B8%BB%E5%AF%BC%E8%88%AA", "http://www.seedit.com/tools/songzimiao.htm?bbs_topic_ad", "http://www.seedit.com/tools/songzimiao.htm?bzref_la=cm", "http://www.seedit.com/tools/songzimiao.htm?from=主导航", "http://www.seedit.com/tools/songzimiao.htm?bzref_la=rj~~", "http://www.seedit.com/tools/songzimiao.htm?from=account_bozhong", "http://www.seedit.com/tools/songzimiao.htm?from=account_thirdpart", "http://www.seedit.com/tools/songzimiao.htm?from=weibo", "http://www.seedit.com/tools/songzimiao.htm?from=www_tools", "http://a.seedit.cn/admin/cms/preview/preview/type/page/id/52a55f35a3c3b15d42000004", "http://www.seedit.com/tools/songzimiao.htm?from=", "http://www.seedit.com", "http://www.seedit.com/tools/songzimiao.htm?", "http://riji.seedit.com", "http://www.seedit.com/tools/songzimiao.htm?from=top_line", "http://www.hao123.com/?tn=99563495_hao_pg", "http://www.hao123.com/?tn=91392420_hao_pg", "http://bbs.seedit.com/forum-24-1.html", "http://riji.seedit.com/home.php?mod=spacecp&ac=mylabel&op=base", "http://www.seedit.com/tools/songzimiao.htm?from=%EF%BF%BD%EF%BF%BD%EF%BF%BD", "http://common.seedit.com/cms/content.html?type=page&id=52a55f35a3c3b15d42000004", "http://bbs.seedit.com/forum-1928-1.html", "http://m.baidu.com/redirect.jsp?from=tc&bd_page_type=1&ssid=0&uid=0&pu=osna…a1aa1604d7bdcea5b0a403b5c&read=0&url=http://bbs.seedit.com/forum-24-1.html", "http://bbs.seedit.com", "http://bbs.seedit.com/index.php", "http://www.seedit.com/tools/songzimiao.htm?mqq_source=iphoneqq&bzref_la=cm", "http://www.hao123.com/?tn=92182484_hao_pg", "http://www.seedit.com/tools/songzimiao.htm?a6fe68eb04a41cb4feed03322998c1ed=6506f8bd4df0f05bb26378d5bb9bcc93", "http://bbs.seedit.com/thread-36959725-1-1.html", "http://bbs.seedit.com/thread-36604878-1-1.html", "http://bbs.seedit.com/thread-3593132-1-1.html", "http://www.seedit.com/tools/songzimiao.htm?from=focus_ad?08d6b4a061280063d3e9b68aab81318c=0d060525aa05d0d123f601f537042c4f", "http://bbs.seedit.com/thread-1216084-1-1.html", "http://bbs.seedit.com/forum.php?mod=viewthread&tid=210801&extra=&ordertype=1&page=1", "http://www.seedit.com/tools/songzimiao.htm?from=涓诲鑸?", "http://bbs.seedit.com/thread-37435471-7-1.html", "http://m.seedit.com/forum.php?mod=viewthread&tid=3661919&mobile=no", "http://bbs.seedit.com/thread-153602-1-1.html", "http://bbs.seedit.com/forum.php?mod=viewthread&tid=37291363&reltid=37392729&pre_pos=5&ext="]
                categories: ["flash", "common_ad", "直接", "top_ad", "bbs", "focus_ad", "exchange", "www_1screen_ad", "bzref_la=rj", "bbs_nav_top_ad", "nav", "%E4%B8%BB%E5%AF%BC%E8%88%AA", "bbs_topic_ad", "bzref_la=cm", "主导航", "bzref_la=rj~~", "account_bozhong", "account_thirdpart", "weibo", "www_tools"]
            },
            series: [
                {
                    dataLabels: {
                        enabled: true
                    },
                    name: '来源',
                    data: [29255, 7017, 4380, 3345, 2408, 1837, 1016, 391, 294, 305, 197, 181, 210, 75, 84, 55, 73, 50, 26, 20]
                }
            ]
        });

    });


};