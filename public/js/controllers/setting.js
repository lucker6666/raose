// 设置
var SettingsCtrl = function($scope, $http, $timeout) {
  $http.get('/api/me/profile').success(function(data) {
    $scope.user = data.data;
  });

  $scope.updateProfile = function() {
    $http.put('/api/me/profile', $scope.user).success(function(data) {
      if (data.error === 0) {
        $scope.showSuccess = true;
        $scope.message = '更新成功鸟';
        $timeout(function() {
          $scope.showSuccess = false;
        }, 2000);
      } else {
        $scope.showFail = true;
        $scope.message = data.msg;
        $timeout(function() {
          $scope.showFail = false;
        }, 2000);
      }
    });
  }
};