'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {
  $http.get('/api/posts').
  success(function(data, status, headers, config) {
    $scope.posts = data.posts;
  });
};

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

// 文档页面
var DocsCtrl = function($scope, $http) {
  $http.get('/api/docs').success(function(data) {
    $scope.docs = data.data;
  })
};

// 话题页面
var TopicsCtrl = function($scope, $http) {
  $http.get('/api/topics').success(function(data) {
    $scope.topics = data.data;
  });
};

// 数据页面
var DatasCtrl = function($scope, $http) {
  $http.get('/api/datas').success(function(data) {
    $scope.datas = data.data;
  })
};

// 添加需求

var AddFeatureCtrl = function($scope, $http, $location) {
  $scope.addFeature = function() {
    $http.post('/api/features', $scope.form).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/features');
      }
    })
  }
};

var AddTopicCtrl = function($scope, $http, $location) {
  $scope.addTopic = function() {
    $http.post('/api/topics', $scope.form).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/topics');
      }
    })
  }
};

var ViewFeatureCtrl = function($scope, $http, $routeParams) {
  $http.get('/api/feature/' + $routeParams.id).success(function(data) {
    $scope.form = data.data;
  })
};

// 查看数据
var ViewDataCtrl = function($scope, $http, $routeParams) {
  $http.get('/api/data/' + $routeParams.id).success(function(data) {
    $scope.form = data.data;
  })
};

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function() {
    $http.post('/api/post', $scope.form).
    success(function(data) {
      $location.path('/');
    });
  };
}

// 添加数据

function AddDataCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitData = function() {
    $http.post('/api/datas', $scope.form).
    success(function(data) {
      $location.path('/datas');
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

function ViewStatusCtrl($scope, $http, $routeParams, $location) {
  $scope.form = {};
  $http.get('/api/status/' + $routeParams.id).success(function(data) {
    console.log(data);
    $scope.form = data.data[0];
  });
  $scope.updateStatus = function() {
    $http.put('/api/status/' + $routeParams.id, {
      name: $scope.form.name,
      desc: $scope.form.desc
    }).success(function(data) {
      console.log(data);
    })
  };

  $scope.deleteStatus = function() {
    $http.delete('/api/status/' + $routeParams.id).success(function(data) {
      console.log(data);
      $location.path('/status');
    })
  }
};

// 添加待办

function AddTodoCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitTodo = function() {
    $http.post('/api/todo', $scope.form).
    success(function(data) {
      $scope.todo.unshift(data);
    });
  };
  // 取得列表
  $http.get('/api/todo').
  success(function(data, status, headers, config) {
    $scope.todo = data;
  });
};

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
  success(function(data) {
    $scope.post = data.post;
  });
}

function StatusCtrl($scope, $http) {
  $http.get('/api/status').success(function(data) {
    $scope.status = data.data;
  })
};

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

var UploadCtrl = ['$scope', '$http',
  function($scope, $http) {
    $scope.onFileSelect = function($files) {
      //$files: an array of files selected, each file has name, size, and type.
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
        });
      }
    }
  }
];

// 注册页面
var RegisterCtrl = function($scope, $http) {
  $scope.sendActiveMail = function() {
    $http.post('/api/sendmail', {
      email: $scope.mail
    }).success(function(data) {
      if (data['error'] === 0) {
        alert('激活邮件发送成功，请查收');
      }
    });
  };
};

// issues 列表页面
var IssuesCtrl = function($scope, $http) {
  $http.get('/api/issues').success(function(data) {
    $scope.issues = data.data;
  });
};

// 添加issue
var AddIssueCtrl = function($scope, $http) {
  $scope.form = {};
  $scope.submitIssue = function() {
    $http.post('/api/issues', $scope.form, function(data) {
      if (data['error'] === 0) {
        alert('添加成功');
      }
    })
  }
};

// 编辑页面
var ViewIssueCtrl = function($scope, $http, $routeParams) {
  var id = $routeParams.id;
  $http.get('/api/issues/' + id).success(function(data) {
    $scope.form = data.data;
  });
};