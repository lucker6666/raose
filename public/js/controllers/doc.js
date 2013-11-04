// 文档页面
var DocsCtrl = function($scope, $http) {
    $http.get('/api/docs').success(function(data) {
        $scope.docs = data.data;
    })
};

var AddDocCtrl = function($scope, $http, $location) {
    $scope.showAddBtn = true;
    $scope.submitDoc = function() {
        $http.post('/api/docs', $scope.doc).success(function(data) {
            if (data['error'] === 0) {
                $location.path('/docs');
            }
        });
    }
};

// 编辑文档
var EditDocCtrl = function($scope, $http, $location, $routeParams) {
    var id = $routeParams.id;
    $scope.showUpdateBtn = true;
    $scope.showViewBtn = true;
    $http.get('/api/doc/' + id + '?raw=1').success(function(data) {
        $scope.doc = data.data;
    });

    $scope.updateDoc = function() {
        $http.put('/api/doc/' + id, $scope.doc).success(function(data) {
            if (data.error === 0) {
                $location.path('/doc/' + id);
            }
        });
    }
};

// 查看文档 

var ViewDocCtrl = function($scope, $http, $routeParams, $location) {
    var id = $routeParams.id;
    $http.get('/api/doc/' + id).success(function(data) {
        $scope.doc = data.data;
    });
    $scope.deleteDoc = function() {
        if (confirm('确定要删除么，删没了你要自己负责哦')) {
            $http.delete('/api/doc/' + id).success(function(data) {
                if (data['error'] === 0) {
                    $location.path('/docs');
                }
            });
        }
    }
};