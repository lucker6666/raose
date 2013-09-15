'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'angularFileUpload']).
config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'partials/index',
      controller: IndexCtrl
    }).
    when('/addPost', {
      templateUrl: 'partials/addPost',
      controller: AddPostCtrl
    }).
    when('/readPost/:id', {
      templateUrl: 'partials/readPost',
      controller: ReadPostCtrl
    }).
    when('/editPost/:id', {
      templateUrl: 'partials/editPost',
      controller: EditPostCtrl
    }).
    when('/deletePost/:id', {
      templateUrl: 'partials/deletePost',
      controller: DeletePostCtrl
    }).
    when('/addStatus', {
      templateUrl: 'partials/addStatus',
      controller: AddStatusCtrl
    }).
    when('/addTodo', {
      templateUrl: 'partials/addTodo',
      controller: AddTodoCtrl
    }).
    when('/upload', {
      templateUrl: 'partials/upload',
      controller: UploadCtrl
    }). // 需求状态
    when(['/status'], {
      templateUrl: 'partials/status',
      controller: StatusCtrl
    }).
    when('/status/:id', {
      templateUrl: 'partials/editStatus',
      controller: ViewStatusCtrl
    }).
    when('/account/active', {
      templateUrl: 'partials/signup',
      controller: RegisterCtrl
    }).
    when('/issues', {
      templateUrl: 'partials/issues',
      controller: IssuesCtrl
    }).
    when('/addIssue', {
      templateUrl: 'partials/addIssue',
      controller: AddIssueCtrl
    }).
    when('/features', {
      templateUrl: 'partials/features',
      controller: FeaturesCtrl
    }).
    when('/features/add', {
      templateUrl: 'partials/addFeature',
      controller: AddFeatureCtrl
    }).
    when('/feature/:id', {
      templateUrl: 'partials/viewFeature',
      controller: ViewFeatureCtrl
    }).
    when('/docs', {
      templateUrl: 'partials/docs',
      controller: DocsCtrl
    }).
    when('/topics', {
      templateUrl: 'partials/topics',
      controller: TopicsCtrl
    }).
    when('/datas', {
      templateUrl: 'partials/datas',
      controller: DatasCtrl
    }).
    when('/datas/add', {
      templateUrl: 'partials/addData',
      controller: AddDataCtrl
    }).
    when('/topics/add', {
      templateUrl: 'partials/addTopic',
      controller: AddTopicCtrl
    }).
    when('/data/:id', {
      templateUrl: 'partials/viewData',
      controller: ViewDataCtrl
    }).
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
  }
]);