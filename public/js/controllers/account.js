// 注册页面
var RegisterCtrl = function($scope, $http) {
  $scope.sendActiveMail = function() {
    $http.post('/api/sendmail', {
      email: $scope.mail
    }).success(function(data) {
      if (data['error'] === 0) {
        alert('激活邮件发送成功，请查收');
      }
    });
  };
};

// 登录

var SigninCtrl = function($scope, $http, $location) {
  $scope.login = function() {
    $http.post('/api/user/signin', $scope.form).success(function(data) {
      if (data['error'] === 0) { 
        $scope.hideNav = false;
        document.location.href = '/me';
      } else {
        alert('登录失败，请重试');
      }
    }).error(function() {
      alert('登录失败，请重试');
    });
  };
};
