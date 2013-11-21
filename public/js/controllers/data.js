// 数据页面
var DatasCtrl = function($scope, $http) {
    $http.get('/api/datas').success(function(data) {
        $scope.datas = data.data;
    })
};

// 查看数据
var ViewDataCtrl = function($scope, $http, $routeParams, $location) {
    $http.get('/api/data/' + $routeParams.id).success(function(data) {
        $scope.form = data.data;

        // 饼状图
        if ($scope.form['chartType'] === 'pie') {
            renderPie(data.data.option, 'data_' + $scope.form._id);
        }

        // 条形图
        if ($scope.form['chartType'] === 'column') {
            renderColumn(data.data.option, 'data_' + $scope.form._id, {
                title: data.name
            });
        }

        // 折线图
        if ($scope.form['chartType'] === 'line') {
            renderLine(data.data.option, 'data_' + $scope.form._id, {
                title: data.name
            });
        }
    });
    $scope.deleteData = function() {
        $http.delete('/api/data/' + $routeParams.id).success(function(data) {
            if (data['error'] === 0) {
                $location.path('/datas');
            }
        });
    };
};

var EditDataCtrl = function($scope, $http, $location, $routeParams, $timeout) {
    $http.get('/api/data/' + $routeParams.id).success(function(data) {
        $scope.form = data.data;
        $scope.showUpdateBtn = true;
        $scope.updateData = function() {
            $http.put('/api/data/' + $routeParams.id, $scope.form).success(function(data) {
                if (data.error === 0) {
                    $scope.showSuccess = true;
                    $scope.success_tip = '更新成功';
                    $location.path('/data/' + $routeParams.id);
                    /* $timeout(function() {
            $scope.showSuccess = false;
          }, 1000);*/
                }
            });
        };
    });
};

// 添加数据

function AddDataCtrl($scope, $http, $location, $routeParams) {
    console.log($routeParams.action);
    $scope.form = {
        type: 'ga',
        option: {
            'max-results': 100,
            'ids': 'ga:63911100',
            'dimensions': 'ga:date'
        }
    };
    $scope.actionName = '添加';
    $scope.showAddBtn = true;
    $scope.submitData = function() {
        $http.post('/api/datas', $scope.form).
        success(function(data) {
            $location.path('/data/' + data.data._id);
        });
    };

    $http.get('/api/users').success(function(data) {
        $scope.members = data.data;
    });

    // 切换数据来源
    $scope.dataTypeChange = function() {
        if ($scope.form.type == 'seedit') {
            $scope.hideGaIds = true;
            $scope.showSeeditType = true;
            $scope.form.chartType = 'column';
        } else {
            $scope.hideGaIds = false;
            $scope.showSeeditType = false;
        }
    };
}

var VisitDataCtrl = function($scope, $http) {
    $http.get('/api/iData/siteRate').success(function(data) {
        $scope.data = data;
    });

    $http.get('http://106.3.38.38:8888/api/tmp/exchange').success(function(data) {
        $scope.exchangeSum = data.sum;
        $scope.lists = data.rows;
    });

    // exchange datas
    ['jrlady', 'zdface', 'ishowx', 'taoyidie', '4meili', 'wumeiw'].forEach(function(one) {
        $http.get('http://106.3.38.38:8888/api/exchange/' + one).success(function(data) {
            if (one === '4meili') one = 'meili';
            $scope[one] = data.data;
        });
    });

      ['dianxin','jrlady','zdface','ishowx','taoyidie','4meili','39baby','xiangcaolady','mmeirong','39','wumeiw'].forEach(function(one){
        //$http.get('/api/baidu.json?type='+one).success(function(data){
            //console.log(data);
            renderColumn({type:'baidu',option:{cat:one}}, one+'-data', {
                title: 'Dianxin'
            });
    });

};