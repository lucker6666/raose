//'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {

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

var AddDocCtrl = function($scope, $http, $location) {
  $scope.submitDoc = function() {
    $http.post('/api/docs', $scope.form).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/docs');
      }
    });
  }
};

// 查看文档 

var ViewDocCtrl = function($scope, $http, $routeParams, $location) {
  $http.get('/api/doc/' + $routeParams.id).success(function(data) {
    $scope.doc = data.data;
  });
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

// todo页面
var TodosCtrl = function($scope, $http) {
  $http.get('/api/todos').success(function(data) {
    $scope.todos = data.data;
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

// 查看话题
var ViewTopicCtrl = function($scope, $http, $routeParams) {
  // 获取话题内容
  $http.get('/api/topic/' + $routeParams.id).success(function(data) {
    $scope.form = data.data;
  });
  // 获取评论
  $http.get('/api/topic/' + $routeParams.id + '/discussions').success(function(data) {
    $scope.list = data.data;
  });
  // 评论关联信息

  // 提交评论
  $scope.submitDiscussion = function() {
    $scope.disussion = {
      type: 'topic',
      typeId: $routeParams.id
    };
    console.log($scope.discussion);
    $http.post('/api/topic/' + $routeParams.id + '/discussions', $scope.discussion).success(function(data) {
      console.log(data);
    });
  };
};

// 查看 todo
var ViewTodoCtrl = function($scope, $http, $routeParams) {
  $http.get('/api/todo/' + $routeParams.id).success(function(data) {
    $scope.form = data.data;
  })
};

// 查看数据
var ViewDataCtrl = function($scope, $http, $routeParams, $location) {
  $http.get('/api/data/' + $routeParams.id).success(function(data) {
    $scope.form = data.data;
    if ($scope.form['chartType'] === 'pie') {
      renderPie(data.data.option, 'data_' + $scope.form._id);
    }

    if ($scope.form['chartType'] === 'column') {
      renderColumn(data.data.option, 'data_' + $scope.form._id, {
        title: data.name
      });
    }
  });
  $scope.deleteData = function() {
    $http.delete('/api/data/' + $routeParams.id).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/datas');
      }
    });
  };
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
  $scope.form = {
    type: 'ga',
    option: {
      'max-results': 100,
      'ids': 'ga:63911100',
      'dimensions': 'ga:date'
    }
  };
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

// 编辑issue页面
var ViewIssueCtrl = function($scope, $http, $routeParams) {
  var id = $routeParams.id;
  $http.get('/api/issue/' + id).success(function(data) {
    $scope.form = data.data;
  });
};

var WeeklyDataCtrl = function($scope, $http) {
  $http.get('http://106.3.38.38:8888/api/site.json').success(function(data) {
    $scope.site = data;
  });

  $http.get('http://106.3.38.38:8888/api/appWeekly.json').success(function(data) {
    $scope.app = data;
  });

  $http.get('http://106.3.38.38:8888/api/seedit.json').success(function(data) {
    $scope.seedit = data;
  });
  // 获取app排名

  $http.get('http://106.3.38.38:8888/api/app.json?type=lates_rank').success(function(data) {
    $scope.appRank = data;
  });

  /*renderVisitData(function(data) {
    renderArea(data, 'all-userview', 'lala');
  });*/
  var site = {
    "all": "ga:62079070",
    "bbs": "ga:644519",
    "www": "ga:644469",
    "event": "ga:63911100",
    "wap": "ga:61918595",
    "i": "ga:67437444",
    "riji": "ga:648824",
    "zhishi": "ga:16257208"
  };

  var siteArray = (function() {
    var tmp = [];
    for (var i in site) {
      tmp.push({
        name: i,
        ga: site[i]
      })
    }
    return tmp;
  })();

  siteArray.forEach(function(one) {
    // 全站流量
    renderVisitData({
      type: 'ga',
      option: {
        ids: one.ga,
        dimensions: 'ga:nthWeek'
      }
    }, 90, '#site-traffic-' + one.name);
  });

  // 广告数据
  /*
  "filters": "ga:eventCategory==广告统计;ga:eventAction!=基础体温",
            "dimensions": "ga:eventAction",
            "metrics": "ga:totalEvents",
             "option": {
              "start-date":"2013-06-26"
             }*/

  renderVisitData({
    type: 'ga',
    option: {
      ids: 'ga:63911100',
      metrics: 'ga:totalEvents',
      filters: "ga:eventCategory==流量交换;ga:eventAction==39"
    }
  }, 14, '#exchange-input');

  renderVisitData({
    type: 'ga',
    option: {
      ids: 'ga:63911100',
      metrics: 'ga:totalEvents',
      filters: "ga:eventCategory==广告位点击统计;ga:eventAction==帖内广告;ga:eventLabel=@流量交换位"
    }
  }, 14, '#exchange-output');

  // app安装
  renderVisitData({
    type: 'umeng',
    api: 'http://106.3.38.38:8888/api/app.json?type=monthly_install',
    dataFormatter: function(data) {
      return data['stats'][0]['data'];
    },
    startTimeFormatter: function(data) {
      var rs = data['stats'][0]['dates'][0].split('-');
      rs[1]--;
      return rs;
    }
  }, 0, '#app-install');

  renderVisitData({
    type: 'umeng',
    api: 'http://106.3.38.38:8888/api/app.json?type=monthly_active',
    dataFormatter: function(data) {
      return data['stats'][0]['data'];
    },
    startTimeFormatter: function(data) {
      var rs = data['stats'][0]['dates'][0].split('-');
      rs[1]--;
      return rs;
    }
  }, 0, '#app-active');

  renderVisitData({
    type: 'umeng',
    api: 'http://106.3.38.38:8888/api/app.json?type=monthly_launch',
    dataFormatter: function(data) {
      return data['stats'][0]['data'];
    },
    startTimeFormatter: function(data) {
      return data['stats'][0]['dates'][0].split('-');
    }
  }, 0, '#app-launch');

  // $http.get('http://106.3.38.38:8888/api/app.json?type=monthly_install').success(function(data) {
  // 渲染图表
  // });
}

// 登录
var SigninCtrl = function($scope, $http, $location) {
  $scope.login = function() {
    $http.post('/api/signin', $scope.form).success(function(data) {
      console.log(data);
      if (data['error'] === 0) {
        $location.path('/');
      }
    });
  };
};

var ViewAdCtrl = function($scope, $http) {
  // view ad data
};