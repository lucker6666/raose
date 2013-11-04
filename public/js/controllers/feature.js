// 需求页面

var FeaturesCtrl = function($scope, $http, $location) {
  $http.get('/api/features').success(function(data) {
    $scope.features = data.data;
  });
  $scope.deleteFeature = function(id) {
    $http.delete('/api/feature/' + id).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/features');
      }
    });
  };
};

// 添加需求

var AddFeatureCtrl = function($scope, $http, $location, $timeout, $routeParams) {
  $scope.addFeature = function() {
    $http.post('/api/features', $scope.form).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/features');
      }
    });
  };
  $scope.form = {};
  $scope.form.files = [];
  $scope.updateFeature = function() {
    $http.put('/api/feature/' + $routeParams.id, $scope.form).success(function(data) {
      if (data.error === 0) {
        $location.path('/feature/' + $routeParams.id);
      }
    });
  };

  var isUpdate = document.location.href.indexOf('edit') !== -1;

  if (isUpdate) {
    $scope.showUpdate = true;
    $scope.showAdd = false;
    $http.get('/api/feature/' + $routeParams.id).success(function(data) {
      $scope.form = data.data;
    });
  } else {
    $scope.showUpdate = false;
    $scope.showAdd = true;
  }

  //$scope.form.files = [];
  // 获取拖进来的文件
  $timeout(function() {
    var dragArea = document.querySelector('#drag-area');

    // 一定要进行 dragover 绑定
    dragArea.addEventListener('dragover', function(e) {
      e.stopPropagation();
      e.preventDefault();
    });
    dragArea.addEventListener('dragenter', function(e) {
      e.stopPropagation();
      e.preventDefault();
      dragArea.style.borderColor = 'red'
    });
    dragArea.addEventListener('dragleave', function(e) {
      dragArea.style.borderColor = '#ccc'
    });

    dragArea.addEventListener('drop', function(e) {
      dragArea.style.borderColor = '#ccc'
      e.stopPropagation();
      e.preventDefault();
      var dt = e.dataTransfer;
      var files = dt.files;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        var formData = new FormData();
        formData.append('file', file);
        var xhr = new XMLHttpRequest()
        //xhr.upload.addEventListener("progress", uploadProgress, false)
        xhr.addEventListener("load", function(x) {
          var res = JSON.parse(x.target.responseText);

          $scope.$apply(function($scope) {
            $scope.form.files.push(res.data);
          });

          console.log($scope.files);
        }, false)
        //xhr.addEventListener("error", uploadFailed, false)
        //xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", "/api/upload")
        //scope.progressVisible = true
        xhr.send(formData)

        //attach event handlers here...
        reader.readAsDataURL(file);
      }
      return false;
    }, false);
  }, 0);
};