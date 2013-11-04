// 话题页面
var TopicsCtrl = function($scope, $http) {
  $http.get('/api/topics').success(function(data) {
    $scope.topics = data.data;
  });
};

// 更新需求

var AddTopicCtrl = function($scope, $http, $location) {
  $scope.addTopic = function() {
    $http.post('/api/topics', $scope.form).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/topics');
      }
    })
  }
};

// 查看话题
var ViewTopicCtrl = function($scope, $http, $routeParams) {
  // 获取话题内容
  $http.get('/api/topic/' + $routeParams.id).success(function(data) {
    $scope.form = data.data;
    $scope.discussion = {
      typeId: data.data._id,
      type: 'topic'
    };
  });
  // 获取评论
  $http.get('/api/topic/' + $routeParams.id + '/discussions').success(function(data) {
    $scope.list = data.data;
  });

  $scope.paste = function() {}
  // 评论关联信息

  // 提交评论
  $scope.submitDiscussion = function() {
    $scope.disussion = {
      type: 'topic',
      typeId: $routeParams.id
    };
    $http.post('/api/topic/' + $routeParams.id + '/discussions', $scope.discussion).success(function(data) {
      $scope.list.unshift($scope.discussion);
    });
  };
};