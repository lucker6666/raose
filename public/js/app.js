var socket = io.connect("http://106.3.38.38:8888/data");

socket.on("connect", function () {
    console.log("Client has connected to the server!");
});

var app = angular.module("myApp", [ "ngRoute", "ui.utils", "ui.date"]).directive("ngEnter",function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            13 === event.which && (scope.$apply(function () {
                scope.$eval(attrs.ngEnter);
            }), event.preventDefault());
        });
    };
}).directive("contenteditable",function () {
        return {
            require: "ngModel",
            link: function (scope, element, attrs, ctrl) {
                element.bind("blur", function () {
                    scope.$apply(function () {
                        ctrl.$setViewValue(element.html());
                    });
                }), ctrl.$render = function () {
                    element.html(ctrl.$viewValue);
                };
            }
        };
    }).filter("unsafe",function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    }).filter("rate",function () {
        return function (rate) {
            return rate ? 0 > rate ? '<span class="vivid">' + rate + "%</span>" : rate + "%" : "0%";
        };
    }).filter("time",function () {
        return function (time) {
            return time ? friendlyDate(time) : "";
        };
    }).filter("toMinute",function () {
        return function (time) {
            if (!time) return "00:00";
            time = Math.round(time);
            var minute = "0" + Math.floor(time / 60), sec = "0" + time % 60;
            return minute.slice(-2) + ":" + sec.slice(-2);
        };
    }).filter("issueLevel",function () {
        return function (level) {
            var map = {
                1: "不赶紧做会死",
                2: "必须做",
                3: "最好做",
                4: "可以做",
                5: "强迫症发作"
            };
            return map[level];
        };
    }).config([ "$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when("/", {
            templateUrl: "partials/me",
            controller: MeCtrl
        }).when("/calendar", {
                title: "产品日历",
                templateUrl: "partials/viewCalendar",
                controller: ViewCalendarCtrl
            }).when("/addCalendar", {
                title: "添加日程",
                templateUrl: "partials/addCalendar",
                controller: AddCalendarCtrl
            }).when("/me", {
                title: "我的空间",
                templateUrl: "partials/me",
                controller: MeCtrl
            }).when("/addStatus", {
                templateUrl: "partials/addStatus",
                controller: AddStatusCtrl
            }).when("/todos/add", {
                templateUrl: "partials/addTodo",
                controller: AddTodoCtrl
            }).when("/upload", {
                templateUrl: "partials/upload",
                controller: UploadCtrl
            }).when("/status", {
                templateUrl: "partials/status",
                controller: StatusCtrl
            }).when("/status/:id", {
                templateUrl: "partials/editStatus",
                controller: ViewStatusCtrl
            }).when("/account/active", {
                templateUrl: "partials/signup",
                controller: RegisterCtrl
            }).when("/issues", {
                templateUrl: "partials/issues",
                controller: IssuesCtrl
            }).when("/issue/:id/edit", {
                templateUrl: "partials/addIssue",
                controller: editIssueCtrl
            }).when("/issue/:id", {
                templateUrl: "partials/viewIssue",
                controller: ViewIssueCtrl
            }).when("/issues/add", {
                templateUrl: "partials/addIssue",
                controller: AddIssueCtrl
            }).when("/features", {
                templateUrl: "partials/features",
                controller: FeaturesCtrl
            }).when("/features/add", {
                templateUrl: "partials/addFeature",
                controller: AddFeatureCtrl
            }).when("/feature/:id/edit", {
                templateUrl: "/partials/addFeature",
                controller: AddFeatureCtrl
            }).when("/feature/:id", {
                templateUrl: "partials/viewFeature",
                controller: ViewFeatureCtrl
            }).when("/topic/:id", {
                templateUrl: "partials/viewTopic",
                controller: ViewTopicCtrl
            }).when("/docs", {
                templateUrl: "partials/docs",
                controller: DocsCtrl
            }).when("/topics", {
                templateUrl: "partials/topics",
                controller: TopicsCtrl
            }).when("/datas", {
                templateUrl: "partials/datas",
                controller: DatasCtrl
            }).when("/todos", {
                templateUrl: "partials/todos",
                controller: TodosCtrl
            }).when("/todo/:id", {
                templateUrl: "partials/viewTodo",
                controller: ViewTodoCtrl
            }).when("/datas/add", {
                templateUrl: "partials/addData",
                controller: AddDataCtrl
            }).when("/topics/add", {
                templateUrl: "partials/addTopic",
                controller: AddTopicCtrl
            }).when("/data/:id/:action", {
                templateUrl: "partials/addData",
                controller: EditDataCtrl
            }).when("/data/:id", {
                templateUrl: "partials/viewData",
                controller: ViewDataCtrl
            }).when("/weeklyData", {
                templateUrl: "partials/weeklyData",
                controller: WeeklyDataCtrl
            }).when("/account/signin", {
                title: "登录", 
                templateUrl: "partials/signin",
                controller: SigninCtrl
            }).when("/docs/add", {
                templateUrl: "partials/addDoc",
                controller: AddDocCtrl
            }).when("/doc/:id/edit", {
                templateUrl: "partials/addDoc",
                controller: EditDocCtrl
            }).when("/doc/:id", {
                templateUrl: "partials/viewDoc",
                controller: ViewDocCtrl
            }).when("/settings", {
                templateUrl: "partials/settings",
                controller: SettingsCtrl
            }).when("/visitData", {
                templateUrl: "partials/visitData",
                controller: VisitDataCtrl
            }).when("/me/following/datas", {
                templateUrl: "partials/foDatas",
                controller: meFoDataCtrl
            }).when("/files/add", {
                templateUrl: "partials/addFile",
                controller: AddFileCtrl
            }).when("/files", {
                templateUrl: "partials/listFiles",
                controller: ListFilesCtrl
            }).when("/file/:id", {
                templateUrl: "partials/viewFile",
                controller: ViewFileCtrl
            }).when("/taxonomy", {
                templateUrl: "partials/addTaxonomy",
                controller: AddTaxonomyCtrl
            }).when("/deploy", {
                templateUrl: "partials/viewDeploy",
                controller: ViewDeployCtrl
            }).when("/members", {
                templateUrl: "partials/members",
                controller: ViewMemberCtrl
            }).when("/miao", {
                templateUrl: "partials/miao",
                controller: MiaoCtrl
            }).when("/apply", {
                templateUrl: "partials/apply",
                controller: ApplyCtrl
            }).when("/tools", {
                templateUrl: "partials/tools",
                controller: ToolCtrl
            }).otherwise({
                redirectTo: "/me"
            });
    } ]);

app.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

// lib
Highcharts.setOptions({
    title: {
        margin: 20,
        y: 20
    },
    //            colors: ['#49C9C3', '#FFBF3E', '#9DD30D', '#DA7D2A', '#39B54A', '#1CC4F5', '#1C95BD', '#5674B9', '#8560A8', '#9999FF'],
    // colors: ['#5D9CEC', '#62C87F', '#F15755', '#FC863F', '#7053B6', '#FFCE55', '#6ED5E6', '#F57BC1', '#DCB186', '#647C9D'],
    colors: ['#5F8B95', '#BA4D51', '#F15755', '#FC863F', '#7053B6', '#FFCE55', '#6ED5E6', '#F57BC1', '#DCB186', '#647C9D'],
    //            colors: ['#1bd0dc', '#f9b700', '#eb6100', '#009944','#eb6877'],
    lang: {
        //设置highcharts的全局常量的中文值，如月份、星期、按钮文字等
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdays: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        resetZoom: '查看全图',
        resetZoomTitle: '查看全图',
        downloadPNG: '下载PNG',
        downloadJPEG: '下载JPEG',
        downloadPDF: '下载PDF',
        downloadSVG: '下载SVG',
        exportButtonTitle: '导出成图片',
        printButtonTitle: '打印图表',
        loading: '数据加载中，请稍候...'
    },
    chart: {
        borderWidth: 0,
        //                marginBottom: 65,
        //                marginTop: 50,
        //              marginRight: 20,
        //                zoomType: 'x',
        selectionMarkerFill: 'rgba(122, 201, 67, 0.25)',
        style: {
            fontFamily: 'Tahoma, "microsoft yahei", 微软雅黑, 宋体;'
        },
        resetZoomButton: {
            theme: {
                fill: 'white',
                stroke: 'silver',
                r: 0,
                states: {
                    hover: {
                        fill: '#41739D',
                        style: {
                            color: 'white'
                        }
                    }
                }
            }
        }
    },
    xAxis: {
        startOnTick: false,
        lineColor: '#6a7791',
        lineWidth: 1,
        //                minorTickinterval: 1,
        tickPixelInterval: 150,
        tickmarkPlacement: 'on',
        showLastLabel: true,
        endOnTick: true
    },
    yAxis: {
        title: {
            text: ''
        },
        min: 0,
        gridLineColor: '#eae9e9',
        showFirstLabel: false
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            innerSize: '45%',
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                color: '#000000',
                connectorColor: '#000000'
            }
        },
        series: {
            pointPalcement: 'off',
            fillOpacity: 0.1,
            shadow: false,
            dataLabels: {
                enabled: false
            }/*,
             marker: {
             enabled: true,
             radius: 4,
             fillColor: null,
             lineWidth: 2,
             lineColor: '#FFFFFF',
             states: {
             hover: {
             enabled: true
             }
             }
             }*/
        }
    },
    legend: {
        borderWidth: 0,
        //                y: 5,
        verticalAlign: 'bottom',
        //            floating: true,
        maxHeight: 57
        //                    symbolWidth: 12
        //                align: 'left'
    },
    tooltip: {
        borderColor: '#666',
        borderWidth: 1,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        useHTML: true,
        crosshairs: {
            color: '#7ac943',
            dashStyle: 'shortdot'
        },
        shared: true
    },
    credits: {
        enabled: false,
        href: 'http://ta.qq.com',
        text: 'ta.qq.com',
        position: {
            align: 'right',
            x: -10,
            verticalAlign: 'bottom',
            y: 0
        }
    }
});


// 通用图表显示

$.fn.createChart = function (option) {
    var defaultOpt = {
        title: {
            text: '示例标题',
            x: -20
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ]
        },
        yAxis: {
            /*  title: {
             text: ''
             },*/
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#808080'
                }
            ]
        },
        tooltip: {
            valueSuffix: ''
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [
            {
                name: '示例数据',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }
        ]
    };

    var wechatOption = {
        title: {
            text: '示例标题',
            x: -20
        },
        subtitle: {
            text: '',
            x: -20
        },
        //colors: ['#7FAEDF', '#7FB887', '#EBCB6B', '#BB7FB2', '#DA7D2A'],
        // colors: ['#478ED7','#4CA458','#EDB638','#5A4B96','#DA7D2A'],
        /*chart: {
         type: 'areaspline',
         backgroundColor: '#fff'
         },*/
        plotOptions: {
            series: {
                fillOpacity: 0.1
            }
        },
        xAxis: {
            lineColor: '#8D8988',
            lineWidth: 2
        },
        yAxis: {
            gridLineColor: '#D1D1D1'
        },
        tooltip: {
            borderColor: '#3C3C3C',
            backgroundColor: '#525254',
            style: {
                color: '#FFFFFF'
            }
        },
        legend: {
            symbolWidth: 12
        }
    };
    $.extend(defaultOpt, wechatOption);
    $.extend(defaultOpt, option);
    console.log(defaultOpt);
    $(this).highcharts(defaultOpt);
};
