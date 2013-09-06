'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {
  $http.get('/api/posts').
  success(function(data, status, headers, config) {
    $scope.posts = data.posts;
  });

  $http.get('/api/status').
  success(function(data, status, headers, config) {
    $scope.status = data;
  });

}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function() {
    $http.post('/api/post', $scope.form).
    success(function(data) {
      $location.path('/');
    });
  };
}

function AddStatusCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitStatus = function() {
    $http.post('/api/status', $scope.form).
    success(function(data) {
      $location.path('/');
    });
  };
}

function AddTodoCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitTodo = function() {
    $http.post('/api/todo', $scope.form).
    success(function(data) {
      // $location.path('/');
      //angular.element('input').val('');
      $scope.todo.unshift(data);
    });
  };

  // 取得列表

  $http.get('/api/todo').
  success(function(data, status, headers, config) {
    $scope.todo = data;
  });

}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
  success(function(data) {
    $scope.post = data.post;
  });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
  success(function(data) {
    $scope.form = data.post;
  });

  $scope.editPost = function() {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
    success(function(data) {
      $location.url('/readPost/' + $routeParams.id);
    });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
  success(function(data) {
    $scope.post = data.post;
  });

  $scope.deletePost = function() {
    $http.delete('/api/post/' + $routeParams.id).
    success(function(data) {
      $location.url('/');
    });
  };

  $scope.home = function() {
    $location.url('/');
  };
}