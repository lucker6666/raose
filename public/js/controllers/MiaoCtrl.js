var ApplyCtrl = function ($scope, $http) {
    $.get('http://106.3.38.38:8004/api/datastore/export?filters=type%3Dapply&start-date=2013-11-01&end-date=2013-12-29').success(function (data) {

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
        $scope.numbers = numbers;

        console.log($scope.numbers);


    });
};

var MiaoCtrl = function ($scope, $http) {

    $.get('http://106.3.38.38:8004/api/datastore/export?type=bless&start-date=2013-11-25&end-date=2013-12-29').success(function (data) {
        console.log(data);
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


        $("#chartContainer").dxChart({
            dataSource: dataSource,
            commonSeriesSettings: {
                type: "bar",
                argumentField: "date"
            },
            series: [
                {
                    valueField: "all",
                    name: "全部愿望"
                },
                {
                    valueField: "make",
                    name: "许愿"
                },
                {
                    valueField: "back",
                    name: "还愿"
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
            title: "许愿数",
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
        $("#views").dxChart({
            dataSource: views,
            commonSeriesSettings: {
                type: "spline",
                argumentField: "date"
            },
            series: [
                {
                    valueField: "pv",
                    name: "PV"
                },
                {
                    valueField: "uv",
                    name: "UV"
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
            title: "页面浏览量",
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


    });


};