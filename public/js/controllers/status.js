function AddStatusCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitStatus = function() {
    $http.post('/api/status', $scope.form).
    success(function(data) {
      $location.path('/');
    });
  };
}

function ViewStatusCtrl($scope, $http, $routeParams, $location) {
  $scope.form = {};
  $http.get('/api/status/' + $routeParams.id).success(function(data) {
    $scope.form = data.data[0];
  });
  $scope.updateStatus = function() {
    $http.put('/api/status/' + $routeParams.id, {
      name: $scope.form.name,
      desc: $scope.form.desc
    }).success(function(data) {

    });
  };

  $scope.deleteStatus = function() {
    $http.delete('/api/status/' + $routeParams.id).success(function(data) {
      $location.path('/status');
    })
  }
};

function StatusCtrl($scope, $http) {
  $http.get('/api/status').success(function(data) {
    $scope.status = data.data;
  })
};