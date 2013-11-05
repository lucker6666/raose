var meCtrl = function($http, $scope) {
  // 获取消息
  $http.get('/api/me/messages').success(function(data) {
    $scope.messages = data.data;
  });
  // 获取todos
  $http.get('/api/me/todos').success(function(data) {
    $scope.todos = data.data;
  });

  // 获取issues
  $http.get('/api/me/issues').success(function(data) {
    $scope.issues = data.data;
  });
};