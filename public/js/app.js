'use strict';
var socket = io.connect('http://106.3.38.38:8888/data');
socket.on('connect', function () {
    console.log('Client has connected to the server!');
});

/*socket.emit('need_data_request', {
    url: 'http://tongji.baidu.com/web/2569732/ajax/post/',
    data: 'viewType=domain&siteId=2987471&st=1386345600000&et=1386345600000&st2=&et2=&indicators=pv_count%2Cvisitor_count%2Cip_count%2Cbounce_ratio%2Cavg_visit_time&order=pv_count%2Cdesc&offset=10000&pageSize=100&clientDevice=all&reportId=13&method=source%2Flink%2Fa&queryId='
});*/

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'angularFileUpload']).
    directive('uiEvent', ['$parse',
        function ($parse) {
            return function ($scope, elm, attrs) {
                var events = $scope.$eval(attrs.uiEvent);
                angular.forEach(events, function (uiEvent, eventName) {
                    var fn = $parse(uiEvent);
                    elm.bind(eventName, function (evt) {
                        var params = Array.prototype.slice.call(arguments);
                        //Take out first paramater (event object);
                        params = params.splice(1);
                        fn($scope, {
                            $event: evt,
                            $params: params
                        });
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                });
            };
        }
    ]).
    directive('contenteditable',function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                // view -> model
                element.bind('blur', function () {
                    scope.$apply(function () {
                        ctrl.$setViewValue(element.html());
                    });
                });

                // model -> view
                ctrl.$render = function () {
                    element.html(ctrl.$viewValue);
                };

                // load init value from DOM
                // ctrl.$setViewValue(element.html());
            }
        };
    }).
    filter("rate",function () {
        return function (rate) {
            if (!rate) return '0%';
            if (rate < 0) return '<span class="vivid">' + rate + '%</span>';
            return rate + '%';
        };
    }).
    filter('time',function () {
        return function (time) {
            if (!time) return '';
            return friendlyDate(time);
        }
    }).
    filter('toMinute',function () {
        return function (time) {
            if (!time) {
                return '00:00';
            }
            var time = Math.round(time);
            var minute = '0' + Math.floor(time / 60);
            var sec = '0' + time % 60;
            return minute.slice(-2) + ':' + sec.slice(-2);
        }
    }).
    filter('issueLevel',function () {
        return function (level) {
            var map = {
                1: '不赶紧做会死',
                2: '必须做',
                3: '最好做',
                4: '可以做',
                5: '强迫症发作'
            };
            return map[level];
        }
    }).
    config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'partials/me',
                    controller: meCtrl
                }).
                when('/addStatus', {
                    templateUrl: 'partials/addStatus',
                    controller: AddStatusCtrl
                }).
                when('/todos/add', {
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
                when('/issue/:id/edit', {
                    templateUrl: 'partials/addIssue',
                    controller: editIssueCtrl
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
                when('/feature/:id/edit', {
                    templateUrl: '/partials/addFeature',
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
                when('/doc/:id/edit', {
                    templateUrl: 'partials/addDoc',
                    controller: EditDocCtrl
                }).
                when('/doc/:id', {
                    templateUrl: 'partials/viewDoc',
                    controller: ViewDocCtrl
                }).
                when('/settings', {
                    templateUrl: 'partials/settings',
                    controller: SettingsCtrl
                }).
                when('/visitData', {
                    templateUrl: 'partials/visitData',
                    controller: VisitDataCtrl
                }).
                when('/me/following/datas', {
                    templateUrl: 'partials/foDatas',
                    controller: meFoDataCtrl
                }).
                when('/me', {
                    templateUrl: 'partials/me',
                    controller: meCtrl
                }).
                when('/files/add', {
                    templateUrl: 'partials/addFile',
                    controller: AddFileCtrl
                }).when('/files', {
                    templateUrl: 'partials/listFiles',
                    controller: ListFilesCtrl
                }).when('/file/:id', {
                    templateUrl: 'partials/viewFile',
                    controller: ViewFileCtrl
                }).when('/taxonomy', {
                    templateUrl: 'partials/addTaxonomy',
                    controller: AddTaxonomyCtrl
                }).when('/deploy', {
                    templateUrl: 'partials/viewDeploy',
                    controller: ViewDeployCtrl
                }).when('/members', {
                    templateUrl: 'partials/members',
                    controller: ViewMemberCtrl
                }).when('/miao',{
                    templateUrl:'partials/miao',
                    controller:MiaoCtrl
                }).when('/apply',{
                    templateUrl:'partials/apply',
                    controller:ApplyCtrl
                }).otherwise({
                    redirectTo: '/me'
                });
            $locationProvider.html5Mode(true);
        }
    ])
    .directive('ngPaste',function () {
        var obj = {
            compile: function (element, attrs) {
                console.log('paste');
                return function (scope, elem, attrs) {
                    elem.bind('paste', function () {
                        var funcName = attrs.ngPaste.replace('(', '').replace(')', '');
                        if (typeof(scope[funcName]) == 'function') {
                            setTimeout(function () {
                                scope.$apply(scope[funcName]);
                            }, 10);
                        }
                    });
                };
            }
        };
        return obj;
    }).run(function ($rootScope, $http) {
        $rootScope.$on('$routeChangeSuccess', function (ev, data) {
            $http.get('/api/usercheck').success(function (data) {
                if (data.data.hasSignin === false) {
                    $rootScope.hideNav = true;
                }
                if (data.data.avatar) {
                    setTimeout(function () {
                        var scope = angular.element($("#avatar")).scope();
                        scope.$apply(function () {
                            scope.avatar = data.data.avatar;
                        });
                    }, 0);
                }
            });
        });
    });