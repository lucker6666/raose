var ApplyCtrl = function ($scope,$http) {

    $http.get('http://106.3.38.38:8004/api/datastore/export?filters=type%3Dapply&start-date=2013-11-01&end-date=2013-12-29').success(function (data) {
        $scope.sum = data.sum;

        var dataSource = (function () {
            return data.rows.map(function (one) {
                return {
                    date: one[0].slice(5),
                    count: one[1] - 0
                }
            });
        })();

        $('#numbers').createChart({
            chart: {
                type: 'areaspline'
            },
            xAxis: {
                categories: data.rows.map(function (one) {
                    return one[0].slice(8);
                })
            },
            series: [
                {
                    name: '申请人数',
                    data: data.rows.map(function (one) {
                        return one[1] - 0;
                    })
                }
            ]
        });
        $scope.sum = data.sum;
    });

};