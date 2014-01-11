// 查看issue
var ViewFeatureCtrl = function ($scope, $http, $location, $routeParams) {
    $http.get('/api/feature/' + $routeParams.id).success(function (data) {
        $scope.form = data.data;
    });
    $scope.deleteFeature = function () {
        if (confirm('确定要删除该需求么')) {
            $http.delete('/api/feature/' + $routeParams.id).success(function (data) {
                if (data.error === 0) {
                    $location.path('/features');
                }
            });
        }
    };

    // 删除附件
    // @todo 删除附件应该同时删除服务器上的文件
    $scope.deleteAttach = function (index) {
        $scope.form.files.splice(index, 1);
        if (confirm('确定要删除附件么')) {
            //发送请求
            $http.put('/api/feature/' + $routeParams.id, {
                action: 'deleteAttachment',
                file: $scope.form.files[index],
                files: $scope.form.files
            }).success(function (data) {
                    if (data.error === 0) {
                        $scope.form = data.data;
                    }
                });
        }
    };

    // 更名
    $scope.renameAttach = function (index) {
        var name = prompt('请输入名字');
        if (name) {
            $scope.form.files[index]['name'] = name;
            //发送请求
            $http.put('/api/feature/' + $routeParams.id, {
                files: $scope.form.files
            }).success(function (data) {
                    if (data.error === 0) {
                        $scope.form = data.data;
                    }
                });
        }
    };

};

// issues 列表页面
var IssuesCtrl = function ($scope, $http) {

    $scope.selected = 1;
    $scope.filters = '';

    $scope.getIssues = function (filters) {
        $http.get('/api/issues?filters=' + encodeURIComponent(filters)).success(function (data) {
            $scope.issues = data.data;
        });
    };

    $scope.getIssues('');

    $http.get('/api/issues/summary').success(function (data) {
        $scope.summary = data.data;
    });
};

// 添加issue
var AddIssueCtrl = function ($scope, $http, $location) {
    $scope.form = {};
    $http.get('/api/users').success(function (data) {
        $scope.users = data.data;
    });
    $scope.submitIssue = function () {
        $http.post('/api/issues', $scope.form).success(function (data) {
            if (data['error'] === 0) {
                $location.path('/issue/' + data.data._id);
            }
        });
    }
    $scope.onpaste = function ($scope, elm, attrs) {
        console.log($scope, elm, attrs);
    }
};

// 查看issue页面
var ViewIssueCtrl = function ($scope, $http, $routeParams, $location) {
    var id = $routeParams.id;
    $http.get('/api/issue/' + id).success(function (data) {
        $scope.form = data.data;
        $scope.discussion = {
            typeId: data.data._id,
            type: 'issue'
        };
    });

    $http.get('/api/issue/' + id + '/messages').success(function (data) {
        $scope.messages = data.data;
    });

    $scope.deleteIssue = function () {
        if (confirm('确定要删除么')) {
            $http.delete('/api/issue/' + id).success(function (data) {
                if (data['error'] === 0) $location.path('/issues');
            });
        }
    };

    $scope.closeIssue = function () {
        if (confirm('确定要关闭么')) {
            $http.put('/api/issue/' + id, {
                action: 'closeIssue'
            }).success(function (data) {
                    console.log(data);
                    $scope.form = data.data;
                });
        }
    };

    $scope.reopenIssue = function () {
        if (confirm('确定要重新开启么')) {
            $http.put('/api/issue/' + id, {
                action: 'reopenIssue'
            }).success(function (data) {
                    console.log(data);
                    $scope.form = data.data;
                });
        }
    };

    // 获取评论
    $http.get('/api/issue/' + $routeParams.id + '/discussions').success(function (data) {
        $scope.list = data.data;
    });

    // 提交评论
    $scope.submitDiscussion = function () {
        $scope.disussion = {
            type: 'issue',
            typeId: $routeParams.id
        };
        $http.post('/api/issue/' + $routeParams.id + '/discussions', $scope.discussion).success(function (data) {
            $scope.list.push(data.data); 
            $scope.discussion.content = '';
        });
    };

};

var editIssueCtrl = function ($scope, $http, $routeParams, $location) {
    var id = $routeParams.id;
    $http.get('/api/users').success(function (data) {
        $scope.users = data.data;
        $http.get('/api/issue/' + id).success(function (data) {
            $scope.form = data.data;
        });
    });

    $scope.submitIssue = function () {
        $http.put('/api/issue/' + id, $scope.form).success(function (data) {
            if (data.error === 0) {
                $location.path('/issue/' + id);
            }
        });
    }
}