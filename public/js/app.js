'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'angularFileUpload']).
filter("rate", function() {
  var filterfun = function(person, sep) {
    sep = sep || " ";
    person = person || {};
    person.first = person.first || "";
    person.last = person.last || "";
    return person.first + sep + person.last;
  };
  return function(rate) {
    if (rate < 0) return '<span class="vivid">' + rate + '%</span>';
    return rate + '%';
  };
}).
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
    when('/issue/:id', {
      templateUrl: 'partials/viewIssue',
      controller: ViewIssueCtrl
    }).
    when('/issues/add', {
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
    when('/topic/:id', {
      templateUrl: 'partials/viewTopic',
      controller: ViewTopicCtrl
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
    when('/todos', {
      templateUrl: 'partials/todos',
      controller: TodosCtrl
    }).
    when('/todo/:id', {
      templateUrl: 'partials/viewTodo',
      controller: ViewTodoCtrl
    }).
    when('/datas/add', {
      templateUrl: 'partials/addData',
      controller: AddDataCtrl
    }).
    when('/topics/add', {
      templateUrl: 'partials/addTopic',
      controller: AddTopicCtrl
    }).
    when('/data/ad', {
      templateUrl: 'partials/viewAdData',
      controller: ViewAdCtrl
    }).
    when('/data/:id/:action', {
      templateUrl: 'partials/addData',
      controller: EditDataCtrl
    }).
    when('/data/:id', {
      templateUrl: 'partials/viewData',
      controller: ViewDataCtrl
    }).
    when('/weeklyData', {
      templateUrl: 'partials/weeklyData',
      controller: WeeklyDataCtrl
    }).
    when('/account/signin', {
      templateUrl: 'partials/signin',
      controller: SigninCtrl
    }).
    when('/docs/add', {
      templateUrl: 'partials/addDoc',
      controller: AddDocCtrl
    }).
    when('/doc/:id', {
      templateUrl: 'partials/viewDoc',
      controller: ViewDocCtrl
    }).
    when('/settings', {
      templateUrl: 'partials/settings',
      controller: SettingsCtrl
    }).
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
  }
])
  .directive('ngPaste', function() {
    var obj = {
      compile: function(element, attrs) {
        console.log('paste');
        return function(scope, elem, attrs) {
          elem.bind('paste', function() {
            var funcName = attrs.ngPaste.replace('(', '').replace(')', '');
            if (typeof(scope[funcName]) == 'function') {
              setTimeout(function() {
                scope.$apply(scope[funcName]);
              }, 10);
            }
          });
        };
      }
    };
    return obj;
  }).run(function($rootScope, $http) {
    $rootScope.$on('$routeChangeSuccess', function(ev, data) {
      $http.get('/api/usercheck').success(function(data) {
        if (data.data.hasSignin === false) {
          $rootScope.hideNav = true;
        }
      });
    });
  });