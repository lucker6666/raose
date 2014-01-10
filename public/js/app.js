var socket = io.connect("http://106.3.38.38:8888/data");

socket.on("connect", function() {
    console.log("Client has connected to the server!");
});

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var routes = [ "me" ];

var app = angular.module("myApp", [ "ngRoute" ]).directive("contenteditable", function() {
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ctrl) {
            element.bind("blur", function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(element.html());
                });
            });
            ctrl.$render = function() {
                element.html(ctrl.$viewValue);
            };
        }
    };
}).filter("unsafe", function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}).filter("rate", function() {
    return function(rate) {
        if (!rate) return "0%";
        if (rate < 0) return '<span class="vivid">' + rate + "%</span>";
        return rate + "%";
    };
}).filter("time", function() {
    return function(time) {
        if (!time) return "";
        return friendlyDate(time);
    };
}).filter("toMinute", function() {
    return function(time) {
        if (!time) {
            return "00:00";
        }
        time = Math.round(time);
        var minute = "0" + Math.floor(time / 60);
        var sec = "0" + time % 60;
        return minute.slice(-2) + ":" + sec.slice(-2);
    };
}).filter("issueLevel", function() {
    return function(level) {
        var map = {
            1: "不赶紧做会死",
            2: "必须做",
            3: "最好做",
            4: "可以做",
            5: "强迫症发作"
        };
        return map[level];
    };
}).config([ "$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    routes.forEach(function(one) {
        $routeProvider.when("/" + one, {
            templateUrl: "partials/" + one,
            controller: window[capitaliseFirstLetter(one) + "Ctrl"]
        });
    });
    $routeProvider.when("/", {
        templateUrl: "partials/me",
        controller: MeCtrl
    }).when("/addStatus", {
        templateUrl: "partials/addStatus",
        controller: AddStatusCtrl
    }).when("/todos/add", {
        templateUrl: "partials/addTodo",
        controller: AddTodoCtrl
    }).when("/upload", {
        templateUrl: "partials/upload",
        controller: UploadCtrl
    }).when("/status", {
        templateUrl: "partials/status",
        controller: StatusCtrl
    }).when("/status/:id", {
        templateUrl: "partials/editStatus",
        controller: ViewStatusCtrl
    }).when("/account/active", {
        templateUrl: "partials/signup",
        controller: RegisterCtrl
    }).when("/issues", {
        templateUrl: "partials/issues",
        controller: IssuesCtrl
    }).when("/issue/:id/edit", {
        templateUrl: "partials/addIssue",
        controller: editIssueCtrl
    }).when("/issue/:id", {
        templateUrl: "partials/viewIssue",
        controller: ViewIssueCtrl
    }).when("/issues/add", {
        templateUrl: "partials/addIssue",
        controller: AddIssueCtrl
    }).when("/features", {
        templateUrl: "partials/features",
        controller: FeaturesCtrl
    }).when("/features/add", {
        templateUrl: "partials/addFeature",
        controller: AddFeatureCtrl
    }).when("/feature/:id/edit", {
        templateUrl: "/partials/addFeature",
        controller: AddFeatureCtrl
    }).when("/feature/:id", {
        templateUrl: "partials/viewFeature",
        controller: ViewFeatureCtrl
    }).when("/topic/:id", {
        templateUrl: "partials/viewTopic",
        controller: ViewTopicCtrl
    }).when("/docs", {
        templateUrl: "partials/docs",
        controller: DocsCtrl
    }).when("/topics", {
        templateUrl: "partials/topics",
        controller: TopicsCtrl
    }).when("/datas", {
        templateUrl: "partials/datas",
        controller: DatasCtrl
    }).when("/todos", {
        templateUrl: "partials/todos",
        controller: TodosCtrl
    }).when("/todo/:id", {
        templateUrl: "partials/viewTodo",
        controller: ViewTodoCtrl
    }).when("/datas/add", {
        templateUrl: "partials/addData",
        controller: AddDataCtrl
    }).when("/topics/add", {
        templateUrl: "partials/addTopic",
        controller: AddTopicCtrl
    }).when("/data/:id/:action", {
        templateUrl: "partials/addData",
        controller: EditDataCtrl
    }).when("/data/:id", {
        templateUrl: "partials/viewData",
        controller: ViewDataCtrl
    }).when("/weeklyData", {
        templateUrl: "partials/weeklyData",
        controller: WeeklyDataCtrl
    }).when("/account/signin", {
        templateUrl: "partials/signin",
        controller: SigninCtrl
    }).when("/docs/add", {
        templateUrl: "partials/addDoc",
        controller: AddDocCtrl
    }).when("/doc/:id/edit", {
        templateUrl: "partials/addDoc",
        controller: EditDocCtrl
    }).when("/doc/:id", {
        templateUrl: "partials/viewDoc",
        controller: ViewDocCtrl
    }).when("/settings", {
        templateUrl: "partials/settings",
        controller: SettingsCtrl
    }).when("/visitData", {
        templateUrl: "partials/visitData",
        controller: VisitDataCtrl
    }).when("/me/following/datas", {
        templateUrl: "partials/foDatas",
        controller: meFoDataCtrl
    }).when("/files/add", {
        templateUrl: "partials/addFile",
        controller: AddFileCtrl
    }).when("/files", {
        templateUrl: "partials/listFiles",
        controller: ListFilesCtrl
    }).when("/file/:id", {
        templateUrl: "partials/viewFile",
        controller: ViewFileCtrl
    }).when("/taxonomy", {
        templateUrl: "partials/addTaxonomy",
        controller: AddTaxonomyCtrl
    }).when("/deploy", {
        templateUrl: "partials/viewDeploy",
        controller: ViewDeployCtrl
    }).when("/members", {
        templateUrl: "partials/members",
        controller: ViewMemberCtrl
    }).when("/miao", {
        templateUrl: "partials/miao",
        controller: MiaoCtrl
    }).when("/apply", {
        templateUrl: "partials/apply",
        controller: ApplyCtrl
    }).when("/tools", {
        templateUrl: "partials/tools",
        controller: ToolCtrl
    }).otherwise({
        redirectTo: "/me"
    });
    $locationProvider.html5Mode(true);
} ]);