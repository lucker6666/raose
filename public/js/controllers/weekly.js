var WeeklyDataCtrl = function ($scope, $http) {

    $http.get(raose.config.dataAPI + '/api/site.json').success(function (data) {
        $scope.site = data;
    });

    $http.get(raose.config.dataAPI + '/api/appWeekly.json').success(function (data) {
        $scope.app = data;
    });

    $http.get(raose.config.dataAPI + '/api/seedit.json').success(function (data) {
        $scope.seedit = data;
    });

    // 获取app排名
    $http.get(raose.config.dataAPI + '/api/app.json?type=lates_rank').success(function (data) {
        $scope.appRank = data;
    });

    var site = {
        "all": "ga:62079070",
        "bbs": "ga:644519",
        "www": "ga:644469",
        "event": "ga:63911100",
        "wap": "ga:61918595",
        "i": "ga:67437444",
        "riji": "ga:648824",
        "zhishi": "ga:16257208"
    };

    renderLine({
        "metrics": "ga:visits,ga:pageviews",
        "end-date": "2",
        "start-date": "365",
        "dimensions": "ga:week",
        "ids": "ga:62079070",
        "max-results": 366
    }, 'site-all', {
        dataTitle: ['访问次数', '页面浏览量'],
        sliceX: false
    });

    $scope.siteStartDate = daysAgo(30);
    $scope.siteEndDate = daysAgo(2);

    var siteArray = (function () {
        var tmp = [];
        for (var i in site) {
            tmp.push({
                name: i,
                ga: site[i]
            })
        }
        return tmp;
    })();

    ['', 'organic', 'referral', '(none)'].forEach(function (one) {
        var option = {
            "metrics": "ga:visits",
            "end-date": "2",
            "start-date": "30",
            "dimensions": "ga:date",
            "ids": "ga:644519",
            "max-results": 366,
            "filters": "ga:medium==" + one
        };

        if (one === '(none)') {
            one = 'none';
            option.filters = 'ga:medium==(none)';
        }

        console.log(option);
        renderLine(option, 'bbs-traffic-' + one, {
            dataTitle: ['访问次数', '页面浏览量'],
            sliceX: false
        });
    });

    siteArray.forEach(function (one) {
        renderLine({
            "metrics": "ga:visits,ga:pageviews",
            "end-date": "2",
            "start-date": "30",
            "dimensions": "ga:date",
            "ids": one.ga,
            "max-results": 366
        }, 'site-traffic-' + one.name, {
            dataTitle: ['访问次数', '页面浏览量'],
            sliceX: false
        });
    });

    ['reply', 'topic', 'topic_web', 'topic_ios', 'topic_android', 'topic_wap', 'reply_web', 'reply_wap', 'reply_ios', 'reply_android'].forEach(function (one) {
        renderVisitData({
            type: 'seedit',
            api: raose.config.dataAPI + '/api/status.json?type=' + one,
            startTimeFormatter: function (one) {
                var start = [];
                start[0] = one[0][0].slice(0, 4);
                start[1] = one[0][0].slice(4, 6);
                start[2] = one[0][0].slice(6, 8);
                return start;
            },
            format: function (one) {
            }
        }, 0, '#site-' + one);
    });

    ['signup', 'signin'].forEach(function (one) {
        renderVisitData({
            type: 'seedit',
            api: raose.config.dataAPI + '/api/status.json?type=' + one,
            startTimeFormatter: function (one) {
                var start = [];
                start[0] = one[0][0].slice(0, 4);
                start[1] = one[0][0].slice(4, 6);
                start[2] = one[0][0].slice(6, 8);
                return start;
            },
            format: function (one) {

            }
        }, 0, '#site-' + one, {
            color: ['#b94a48'],
            lineColor: '#b94a48'
        });
    });

    $http.get(raose.config.dataAPI + '/api/app.json?type=status').success(function (data) {
        var installAll = data['stats'][0]['install_all'] + data['stats'][1]['install_all'];
        $scope.app.installAll = installAll;
    });

    $http.get(raose.config.dataAPI + '/api/app.json?type=thisWeekIosFrom').success(function (data) {
        data.stats.forEach(function (one, index) {
            data.stats[index]['data'] = data.stats[index]['data'].reduce(function (pre, next) {
                return pre + next;
            });
        });
        $scope.app.from = data.stats;
        $scope.app.fromIosSum = (function () {
            var sum = 0;
            data.stats.forEach(function (one) {
                sum += one.data
            });
            return sum;
        })();
    });

    $http.get(raose.config.dataAPI + '/api/app.json?type=thisWeekAndroidFrom').success(function (data) {
        data.stats.forEach(function (one, index) {
            data.stats[index]['data'] = data.stats[index]['data'].reduce(function (pre, next) {
                return pre + next;
            });
        });
        data.stats.sort(function (one, two) {
            if (one.data > two.data) return -1;
            return 1;
        });
        $scope.app.fromAndroid = data.stats;
        $scope.app.fromAndroidSum = (function () {
            var sum = 0;
            data.stats.forEach(function (one) {
                sum += one.data
            });
            return sum;
        })();
    });

    // 所有渠道来源

    $http.get(raose.config.dataAPI + '/api/app.json?type=allAndroidFrom').success(function (data) {
        $scope.app.allFromAndroid = data.stats;
    });

    $http.get(raose.config.dataAPI + '/api/app.json?type=allIosFrom').success(function (data) {
        $scope.app.allFromIos = data.stats;
    });

    $http.get(raose.config.dataAPI + '/api/status.json?type=member').success(function (data) {
        data = data.reverse();
        $scope.member = data[0][1];
    });

    ['member', 'beiyun_member_num', 'chanhou_member_num', 'huaiyun_member_num'].forEach(function (one) {
        $http.get(raose.config.dataAPI + '/api/status.json?type=' + one).success(function (data) {
            data = data.reverse();
            $scope[one] = data[0][1];
        });
    });

    // app安装
    renderVisitData({
        type: 'umeng',
        api: raose.config.dataAPI + '/api/app.json?type=monthly_install',
        dataFormatter: function (data) {
            return data['stats'][0]['data'];
        },
        startTimeFormatter: function (data) {
            return data['stats'][0]['dates'][0].split('-');
        }
    }, 0, '#app-install');
    console.log(raose.config.dataAPI);
    renderVisitData({
        type: 'umeng',
        api: raose.config.dataAPI + '/api/app.json?type=monthly_active',
        dataFormatter: function (data) {
            return data['stats'][0]['data'];
        },
        startTimeFormatter: function (data) {
            return data['stats'][0]['dates'][0].split('-');
        }
    }, 0, '#app-active');

    renderVisitData({
        type: 'umeng',
        api: raose.config.dataAPI + '/api/app.json?type=monthly_launch',
        dataFormatter: function (data) {
            return data['stats'][0]['data'];
        },
        startTimeFormatter: function (data) {
            return data['stats'][0]['dates'][0].split('-');
        }
    }, 0, '#app-launch');

}