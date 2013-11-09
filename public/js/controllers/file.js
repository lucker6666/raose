var AddFileCtrl = function($scope, $http) {
    $scope.addFile = function() {
        $http.post('/api/files', $scope.file).success(function(data) {
            console.log(data);
        });
    }
}
var ListFilesCtrl = function($scope, $http) {
    $http.get('/api/files').success(function(data) {
        $scope.files = data.data;
    });
};

var ViewFileCtrl = function($scope, $http, $routeParams) {
    $http.get('/api/file/' + $routeParams.id).success(function(data) {
        $scope.file = data.data;
    });
};