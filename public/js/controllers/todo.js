// todo页面
var TodosCtrl = function($scope, $http) {
    $http.get('/api/todos').success(function(data) {
        $scope.todos = data.data;
    })
};

// 查看 todo
var ViewTodoCtrl = function($scope, $http, $routeParams, $location) {
    var id = $routeParams.id;
    $http.get('/api/todo/' + id).success(function(data) {
        $scope.form = data.data;
        $scope.discussion = {
            typeId: data.data._id,
            type: 'todo'
        };
    });
    // 获取评论
    $http.get('/api/todo/' + $routeParams.id + '/discussions').success(function(data) {
        $scope.list = data.data;
    });

    // 提交评论
    $scope.submitDiscussion = function() {
        $scope.disussion = {
            type: 'todo',
            typeId: $routeParams.id
        };
        $http.post('/api/todo/' + $routeParams.id + '/discussions', $scope.discussion).success(function(data) {
            $scope.list.unshift(data.data);
            $scope.discussion.content = '';
        });
    };
    $scope.deleteTodo = function() {
        if (confirm('确定要删除么')) {
            $http.delete('/api/todo/' + id).success(function(data) {
                if (data['error'] === 0) $location.path('/todos');
            });
        }
    };
    // 更改状态
    $scope.updateStatus = function() {
        if (confirm('确定要更新状态?')) {
            $http.put('/api/todo/' + id, {
                action: 'updateStatus',
                status: $scope.form.status
            }).success(function(data) {
                $location.path('/todos');
            });
        }
    };
};

// 添加待办

function AddTodoCtrl($scope, $http, $location) {
    $scope.form = {};
    // 成员列表
    $http.get('/api/users').success(function(data) {
        $scope.users = data.data;
    });

    // 需求列表
    $http.get('/api/features').success(function(data) {
        $scope.features = data.data;
    });

    $scope.submitTodo = function() {
        $http.post('/api/todos', $scope.form).
        success(function(data) {
            if (data.error === 0) {
                $location.path('/todos');
            }
        });
    };

    $scope.setFeature = function(index) {
        console.log(index);
    }

};