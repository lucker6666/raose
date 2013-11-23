// 设置
var SettingsCtrl = function($scope, $http, $timeout,$location) {
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

  $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      var $file = $files[i];
      $http.uploadFile({
        url: 'api/upload', //upload.php script, node.js route, or servlet uplaod url)
        data: {
          myObj: $scope.myModelObj
        },
        file: $file
      }).then(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
        // 设置头像
        $http.put('/api/me/setAvatar',{file:data.data.data.path + '.'+data.data.data.ext}).success(function(data){
          if(data.error===0){
            $scope.user.avatar = data.data;
            //alert('设置头像成功');
            document.location.reload();
          }else{
            alert(data.msg);
          }
        })
      });
    }
  }

};