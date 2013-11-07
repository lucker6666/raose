var AddTaxonomyCtrl = function($scope, $http) {
    $scope.addTaxonomy = function() {
        $http.post('/api/taxonomys', $scope.form).success(function(data) {
            console.log(data);
        });
    };

    $http.get('/api/taxonomys?type=iType').success(function(data) {
        $scope.types = data.data;
        $scope.types.push({
            name: 'iType'
        });

    });

};