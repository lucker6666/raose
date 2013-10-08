const API = 'http://106.3.38.38:8888'
// 日期格式化
var format = function(date) {
    var month = (date.getMonth() + 1) + '';
    var day = date.getDate() + '';
    return date.getFullYear() + '-' + (month.length === 1 ? '0' + month : month) + '-' + (day.length === 1 ? '0' + day : day);
};

var daysAgo = function(day) {
    var today = +new Date();
    var offset = day * 24 * 3600 * 1000;
    return format(new Date(today - offset));
}

// google 数据不实时，只统计到两天前
const now = daysAgo(2);
const oneMonthAgo = daysAgo(30);

var addFav = function(request) {
    var fav = localStorage.getItem('fav');
    if (!fav) {
        fav = [];
    } else {
        fav = JSON.parse(fav);
    }

    fav.push({
        type: request.type,
        key: request.key
    });
    localStorage.setItem('fav', JSON.stringify(fav));
},
    delFav = function(request) {
        var fav = localStorage.getItem('fav');
        var ret;
        if (!fav) {
            ret = 'success';
        }
        fav = JSON.parse(fav);
        console.log(fav)
        var data = {
            type: request.type,
            key: request.key
        };
        fav.forEach(function(one, index) {
            if (one.type === data.type && one.key === data.key) {
                console.log('找到啦', index);
                fav.splice(index, 1);
                console.log(fav)
            }
        });
        localStorage.setItem('fav', JSON.stringify(fav));
    }

    function number_format(value, fixed, currency) {
        var fixed = fixed || 0;
        var currency = currency || '';
        isNaN(parseFloat(value)) ? value = 0 : value = parseFloat(value);
        v = value.toFixed(fixed).toString();
        var ps = v.split('.');
        var whole = ps[0];
        var sub = ps[1] ? '.' + ps[1] : '';
        var r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
            whole = whole.replace(r, '$1' + ',' + '$2');
        }
        v = whole + sub;
        if (v.charAt(0) == '-') {
            return currency + '-' + '$' + v.substr(1);
        }
        return currency + v;
    }

    function avgg(numbers) {

        console.log('numbers are', numbers);
        var length = 0;
        var all = 0;
        var min = Math.min.apply(Math, numbers);
        var max = Math.max.apply(Math, numbers);

        console.log('min', min);
        console.log('max', max);

        numbers.forEach(function(one) {
            if (one > 0) {
                length++;
                all = all * 1 + one * 1;
            }
        });
        console.log(all);
        console.log(length);
        return parseInt((all - min - max) / (length - 2), 10);
    }

    // 面积图
var renderArea = function(data, id, title, avg, showAll, multi, lessLabel) {
    var flow = [],
        labels = [],
        BLANK = true; //设置为false，则利用parsePoint显示期间线段。
    var datas = data.rows;
    var x = datas.map(function(one) {
        return one[0].slice(4);
    });

    if (lessLabel) {
        x = x.map(function(one) {
            if (one.slice(-2) % 5) return '';
            else return one;
        })
    } else {
        x = datas.map(function(one) {
            return one[0].slice(-2);
        });
    }

    var y = datas.map(function(one) {
        return one[1] * 1;
    });

    // console.log('y is',y);
    //var yy1 = y;
    //var aaa1 = avgg(yy1);

    var all = y.reduce(function(pre, cur) {
        return pre * 1 + cur * 1;
    });

    //var ava = all / y.length;
    // ava = parseInt(ava, 10);
    ava = avgg(y);
    var data = [{
        name: '产品A',
        value: y,
        color: '#888',
        area_color: '#ccc',
        linewidth: 2
    }];

    //多个数据源
    if (multi) {
        var y2 = datas.map(function(one) {
            return one[2];
        });
        data.push({
            name: '产品B',
            value: y2,
            color: '#888',
            area_color: '#F9E1E4',
            linewidth: 2
        });

        // var all2 = y2.reduce(function(pre, cur) {
        //     return pre * 1 + cur * 1;
        // });

        // var ava2 = all2 / y2.length;
        // ava2 = parseInt(ava2, 10);
        var ava2 = avgg(y2);

    }

    var avgTxt = (avg ? '平均:' + ava : '');

    if (multi) {
        avgTxt = (avg ? '前平均:' + ava : '') + (avg ? '后平均:' + ava2 : '');
    }

    var chart = new iChart.Area2D({
        render: id,
        data: data,
        align: 'right',
        background_color: '#fafafa',
        title: {
            text: title,
            font: '微软雅黑',
            color: '#666',
            height: 30,
            fontsize: 20,
            color: '#000',
            fontweight: 'normal',
            border: {
                enable: false,
                width: [0, 0, 2, 0],
                color: '#404b5a'
            }
        },
        subtitle: {
            text: (showAll ? '总共:' + all : '') + avgTxt,
            font: 'Arial',
            color: '#b4b4b4',
            fontweight: 'normal'
        },
        footnote: {
            text: '',
            font: '微软雅黑',
            color: '#d4e0ec',
            height: 30,
            border: {
                enable: true,
                width: [2, 0, 0, 0],
                color: '#1e242c'
            }
        },
        padding: '2 50',
        border: {
            enable: false,
            width: [0, 20, 0, 20],
            color: '#222831'
        },
        // width: 900,
        //height: 300,
        shadow: false,
        gradient: false, //应用背景渐变
        tip: {
            enable: true,
            shadow: true,
            listeners: {
                parseText: function(tip, name, value, text, i) {
                    return "<span style='color:#005268;font-size:16px;font-weight:600;'>数量" + value + "</span>";
                }
            }
        },
        crosshair: {
            enable: true,
            line_width: 1,
            line_color: '#888' //十字线的颜色
        },
        sub_option: {
            smooth: true,
            hollow_inside: true,
            hollow_color: '#FEFEFE',
            point_size: 10,
            label: false
        },
        listeners: {
            /**
             * d:相当于data[0],即是一个线段的对象
             * v:相当于data[0].value
             * x:计算出来的横坐标
             * x:计算出来的纵坐标
             * j:序号 从0开始
             */
            parsePoint: function(d, v, x, y, j) {
                //利用序号进行过滤春节休息期间
                if (BLANK && (v == 0))
                    return {
                        ignored: true
                    } //ignored为true表示忽略该点
            }
        },
        coordinate: {
            // width: '98%',
            //height: 200,
            axis: {
                color: '#9f9f9f',
                width: [0, 0, 2, 2]
            },
            grid_color: '#ececec',
            scale: [{
                position: 'left'
                /* label: {
                        color: '#d4e0ec',
                        font: '微软雅黑',
                        fontweight: 600
                    },
                    start_scale: 0,
                    end_scale: 100,
                    scale_space: 10,
                    scale_size: 2,
                    scale_color: '#9f9f9f'*/
            }, {
                position: 'bottom',
                /*label: {
                        color: '#d4e0ec',
                        font: '微软雅黑',
                        fontweight: 600
                    },*/
                labels: x
            }]
        }
    });

    //利用自定义组件构造说明文本
    /*    chart.plugin(new iChart.Custom({
        drawFn: function() {
            //计算位置
            var coo = chart.getCoordinate(),
                x = coo.get('originx'),
                y = coo.get('originy');
            //渲染单位
            chart.target.textAlign('start')
                .textBaseline('bottom')
                .textFont('600 11px 微软雅黑')
                .fillText('销售量', x - 40, y - 24, false, '#699fb7')
                .fillText('万件', x - 30, y - 10, false, '#699fb7')
                .textAlign('end')
                .fillText('2月', x - 14, y + coo.get('height') + 20, false, '#699fb7');

        }
    }));*/
    //开始画图
    chart.draw();
    //console.log(chart);
    //chart.setUp();
}

    function renderMulti(keys, id, title, option) {
        var eventOption = {
            'ids': 'ga:63911100',
            'dimensions': 'ga:date',
            'metrics': 'ga:totalEvents',
            'start-date': daysAgo(60),
            'end-date': now,
            'max-results': 100
        };

        if (option && option['start-date']) {
            eventOption['start-date'] = option['start-date'];
        }

        var urls = [];
        keys.forEach(function(one) {
            eventOption.filters = buildFilter(one);
            urls.push({
                url: 'http://106.3.38.38:8888/api/ga.json?' + $.param(eventOption)
            });
        });

        var url1 = (function() {
            eventOption.filters = buildFilter(keys[0]);
            return 'http://106.3.38.38:8888/api/ga.json?' + $.param(eventOption);
        })();

        var url2 = (function() {
            eventOption.filters = buildFilter(keys[1]);
            return 'http://106.3.38.38:8888/api/ga.json?' + $.param(eventOption);
        })();

        //console.log(url1);
        // 队列请求，同时请求，但有共同callback
        $.when($.ajax({
                url: url1
            }),
            $.ajax({
                url: url2
            })).then(function(resp1, resp2) {
            //this callback will be fired once all ajax calls have finished.
            // 合并row数据
            var data = resp1[0],
                data2 = resp2[0];

            data.rows.forEach(function(one, index) {
                one.push(data2.rows[index][1]);
            });
            renderArea(data, id, title, true, false, true, true);
        });
    }

var config = {
    "all": "62079070",
    "bbs": "644519",
    "www": "644469",
    "event": "63911100",
    "m": "61918595",
    "i": "67437444",
    "riji": "648824",
    "zhishi": "16257208"
}
// 访问数据
// all ga:62079070
var renderVisitData = function(option, offset, target, chartOption) {

    var api = '';

    if (option.type === 'ga') {
        var eventOption = {
            'ids': option.option.ids,
            'dimensions': 'ga:date',
            'metrics': 'ga:visits',
            'start-date': daysAgo(offset),
            'end-date': now,
            'max-results': 1000
        };
        $.extend(eventOption, option.option);
        api = 'http://173.208.199.49:8888' + '/api/ga.json?' + $.param(eventOption)
    } else if (option.type === 'umeng') {
        api = option.api;
    } else if (option.type === 'seedit') {
        api = option.api;
    }
    $.get(api, function(data) {
        var start;
        var datas = [];

        if (option.startTimeFormatter) {
            start = option.startTimeFormatter(data);
        }

        if (option.dataFormatter) {
            datas = option.dataFormatter(data);
        }

        if (option.type === 'ga') {
            var raw = data.rows;
            datas = raw.map(function(one) {
                return one[1] * 1;
            });
            var start = data['query']['start-date'] // daysAgo(offset);
            start = start.split('-');
            start[1]--;
        }

        if (option.type === 'umeng') {}

        if (option.type === 'seedit') {
            datas = data.map(function(one) {
                return one[1] * 1;
            });
        }

        $(target).highcharts({
            chart: {
                zoomType: 'x',
                spacingRight: 0, // 跟右边距离
                spacingLeft: 0 //,
                // margin: [0, 0, 0, 15]
                // colors:['']
            },
            title: {
                text: null // 标题
            },
            subtitle: {
                // text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime',
                maxZoom: 14 * 24 * 3600000, // fourteen days
                title: {
                    text: null // 隐藏x坐标轴标题
                },
                labels: {
                    formatter: function() {
                        return format(new Date(this.value)).slice(5);
                    }
                }
            },
            yAxis: {
                title: {
                    text: null //隐藏y坐标轴标题
                },
                gridLineWidth: 1,
                gridLineColor: '#ececec'
            },

            tooltip: {
                shared: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, chartOption && chartOption['color'] ? chartOption['color'][0] : Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(chartOption && chartOption['color'] ? chartOption['color'][0] : Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    lineWidth: 1, // 线条宽
                    lineColor: (function() {
                        return chartOption && chartOption['lineColor'] ? chartOption['lineColor'] : Highcharts.getOptions().colors[0];
                    })(),
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: '访问次数',
                pointInterval: 24 * 3600 * 1000,
                pointStart: Date.UTC(start[0], start[1] - 1, start[2]),
                data: datas
            }]
        });

    });
};

var parseOption = function(option) {
    if (!/-/.test(option['start-date'])) {
        option['start-date'] = daysAgo(option['start-date']);
    }

    if (!/-/.test(option['end-date'])) {
        option['end-date'] = daysAgo(option['end-date']);
    }
    var params = $.param(option);
    var API = 'http://173.208.199.49:8888/api/ga.json?' + params;
    return API;
}

var renderPie = function(option, id) {
    var API = parseOption(option);
    $.get(API).success(function(data) {
        // 显示饼形图表
        var datas = (function() {
            var raw = data.rows;
            raw.forEach(function(one) {
                one[1] *= 1;
            });
            return raw
        })();

        $('#' + id).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: null //'Browser market shares at a specific website, 2010'
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
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: datas
            }]
        });

        // 显示图表结束
    });

}

var renderColumn = function(option, id, chartOption) {
    var API = parseOption(option);
    $.get(API).success(function(data) {
        // begin
        // 获取x轴时间坐标 
        var raw = data.rows;

        var series = [];
        var raw = data.rows;
        var len = raw[0].length - 1;
        for (var i = 1; i <= len; i++) {
            series.push({
                name: chartOption['dataTitle'] && chartOption['dataTitle'][i - 1] ? chartOption['dataTitle'][i - 1] : '数据',
                data: (function() {
                    return raw.map(function(one) {
                        return one[i] * 1;
                    });
                })()
            });
        }

        var x = (function() {
            return raw.map(function(one) {
                if (chartOption.sliceX === true) {
                    return one[0].slice(4);
                }
                return one[0];
            });
        })();

        var y = (function() {
            return raw.map(function(one) {
                return one[1] * 1;
            });
        })();
        // 获取y轴坐标
        $('#' + id).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: chartOption && chartOption.title ? chartOption.title : null
            },
            subtitle: {
                text: null //'Source: WorldClimate.com'
            },
            xAxis: {
                categories: x,
                labels: {
                    //step: 10 //THIS WILLS KIP EVERY OTHER LABEL
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '数据'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: series
        });
        // end
    });
};

var renderLine = function(option, id, chartOption) {
    var API = parseOption(option);
    $.get(API).success(function(data) {
        var series = [];
        var raw = data.rows;
        var len = raw[0].length - 1;
        for (var i = 1; i <= len; i++) {
            series.push({
                name: chartOption['dataTitle'] && chartOption['dataTitle'][i - 1] ? chartOption['dataTitle'][i - 1] : '数据',
                data: (function() {
                    return raw.map(function(one) {
                        return one[i] * 1;
                    });
                })()
            });
        }
        raw.forEach(function(one) {
            one[0] = one[0] + ''; // 第一个转换为字符
            console.log(one[0]);
            one[1] *= 1;
        });

        var x = (function() {
            return raw.map(function(one) {
                return one[0].slice(4);
            });
        })();

        var y = (function() {
            return raw.map(function(one) {
                return one[1] * 1;
            });
        })();

        $('#' + id).highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: null,
                x: -20 //center
            },
            subtitle: {
                text: null,
                x: -20
            },
            xAxis: {
                categories: x,
                labels: {
                    step: 10 //THIS WILLS KIP EVERY OTHER LABEL
                }
            },
            yAxis: {
                title: {
                    text: '次数'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '次'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: series
        });
    });

}

var iRenderArea = function(option, id, chartOption) {
    var API = parseOption(option);
    $.get(API).success(function(data) {

        var series = [];
        var raw = data.rows;
        var len = raw[0].length - 1;
        for (var i = 1; i <= len; i++) {
            series.push({
                name: chartOption['dataTitle'][i - 1],
                data: (function() {
                    return raw.map(function(one) {
                        return one[i] * 1;
                    });
                })()
            });
        }
        console.log(series);
        $('#' + id).highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Average fruit consumption during one week'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF'
            },
            xAxis: {
                categories: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ],
                plotBands: [{ // visualize the weekend
                    from: 4.5,
                    to: 6.5,
                    color: 'rgba(68, 170, 213, .2)'
                }]
            },
            yAxis: {
                title: {
                    text: 'Fruit units'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' units'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: series
        });
    });

}