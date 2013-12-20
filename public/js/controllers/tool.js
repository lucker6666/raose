var ToolCtrl = function ($scope, $http) {
    $scope.url = 'http://www.seedit.com/tools/songzimiao.htm';
    $scope.urls = [
        {
            param: 'kk',
            name: '站外QQ群',
            short: 'QQ',
            url: ''
        },
        {
            param: 'ky',
            name: 'QQ群邮件',
            short: 'Q邮',
            url: ''
        },
        {
            param: 'ak',
            name: '爱心妈妈QQ群',
            short: '爱Q',
            url: ''
        },
        {
            param: 'wx',
            name: '微信推广',
            short: '微信',
            url: ''
        },
        {
            param: 'wb',
            name: '新浪微博',
            short: '新浪',
            url: ''
        }
    ];

    $scope.$watch('url', function () {
        console.log($scope.url);
        $scope.urls = (function () {
            return $scope.urls.map(function (one) {
                var end = '';
                if ($scope.url.indexOf('?') !== -1) {
                    end = '&bzref_la=' + one.param;
                } else {
                    end = '?bzref_la=' + one.param;
                }
                one.url = $scope.url + end;
                return one;
            });
        })();
    });


};
