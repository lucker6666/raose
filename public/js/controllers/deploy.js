var ViewDeployCtrl =  function($scope,$http){
    $http.get('/api/log/deploy').success(function(data){
        $scope.lists = data.data;
    });
}