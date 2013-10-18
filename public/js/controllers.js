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
    $http.post('/api/docs', $scope.doc).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/docs');
      }
    });
  }
};

// 编辑文档
var EditDocCtrl = function($scope, $http, $location, $routeParams) {
  var id = $routeParams.id;
  $http.get('/api/doc/' + id + '?raw=1').success(function(data) {
    $scope.doc = data.data;
  });

  $scope.updateDoc = function() {
    $http.put('/api/doc/' + id, $scope.doc).success(function(data) {
      console.log(data);
    });
  }
};

// 查看文档 

var ViewDocCtrl = function($scope, $http, $routeParams, $location) {
  var id = $routeParams.id;
  $http.get('/api/doc/' + id).success(function(data) {
    $scope.doc = data.data;
  });
  $scope.deleteDoc = function() {
    if (confirm('确定要删除么，删没了你要自己负责哦')) {
      $http.delete('/api/doc/' + id).success(function(data) {
        if (data['error'] === 0) {
          $location.path('/docs');
        }
      });
    }
  }
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

var AddFeatureCtrl = function($scope, $http, $location, $timeout) {
  $scope.addFeature = function() {
    $http.post('/api/features', $scope.form).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/features');
      }
    });
  }

  $scope.files = [];
  // 获取拖进来的文件
  $timeout(function() {
    var dragArea = document.querySelector('#drag-area');

    // 一定要进行 dragover 绑定
    dragArea.addEventListener('dragover', function(e) {
      e.stopPropagation();
      e.preventDefault();
    });
    dragArea.addEventListener('dragenter', function(e) {
      e.stopPropagation();
      e.preventDefault();
      dragArea.style.borderColor = 'red'
    });
    dragArea.addEventListener('dragleave', function(e) {
      dragArea.style.borderColor = '#ccc'
    });

    dragArea.addEventListener('drop', function(e) {
      dragArea.style.borderColor = '#ccc'
      console.log('droped');
      e.stopPropagation();
      e.preventDefault();
      var dt = e.dataTransfer;
      var files = dt.files;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        var formData = new FormData();
        formData.append('file', file);
        var xhr = new XMLHttpRequest()
        //xhr.upload.addEventListener("progress", uploadProgress, false)
        xhr.addEventListener("load", function(x) {
          var res = JSON.parse(x.target.responseText);

          $scope.$apply(function($scope) {
            $scope.files.push(res);
          });

          console.log($scope.files);
        }, false)
        //xhr.addEventListener("error", uploadFailed, false)
        //xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", "/api/upload")
        //scope.progressVisible = true
        xhr.send(formData)

        //attach event handlers here...
        reader.readAsDataURL(file);
      }
      return false;
    }, false);
  }, 0);
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

// 查看 todo
var ViewTodoCtrl = function($scope, $http, $routeParams, $location) {
  var id = $routeParams.id;
  $http.get('/api/todo/' + id).success(function(data) {
    $scope.form = data.data;
  });
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
        console.log(data);
      });
    }
  };
};

// 查看数据
var ViewDataCtrl = function($scope, $http, $routeParams, $location) {
  $http.get('/api/data/' + $routeParams.id).success(function(data) {
    $scope.form = data.data;

    // 饼状图
    if ($scope.form['chartType'] === 'pie') {
      renderPie(data.data.option, 'data_' + $scope.form._id);
    }

    // 条形图
    if ($scope.form['chartType'] === 'column') {
      renderColumn(data.data.option, 'data_' + $scope.form._id, {
        title: data.name
      });
    }

    // 折线图
    if ($scope.form['chartType'] === 'line') {
      renderLine(data.data.option, 'data_' + $scope.form._id, {
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

var EditDataCtrl = function($scope, $http, $location, $routeParams, $timeout) {
  $http.get('/api/data/' + $routeParams.id).success(function(data) {
    $scope.form = data.data;
    $scope.action = 'update';
    $scope.actionName = '更新';
    $scope.updateData = function() {
      $http.put('/api/data/' + $routeParams.id, $scope.form).success(function(data) {
        if (data.error === 0) {
          $scope.showSuccess = true;
          $scope.success_tip = '更新成功';
          $location.path('/data/' + $routeParams.id);
          /* $timeout(function() {
            $scope.showSuccess = false;
          }, 1000);*/
        }
      });
    };
  });
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

function AddDataCtrl($scope, $http, $location, $routeParams) {
  console.log($routeParams.action);
  $scope.form = {
    type: 'ga',
    option: {
      'max-results': 100,
      'ids': 'ga:63911100',
      'dimensions': 'ga:date'
    }
  };
  $scope.actionName = '添加';
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
    $scope.form = data.data[0];
  });
  $scope.updateStatus = function() {
    $http.put('/api/status/' + $routeParams.id, {
      name: $scope.form.name,
      desc: $scope.form.desc
    }).success(function(data) {

    })
  };

  $scope.deleteStatus = function() {
    $http.delete('/api/status/' + $routeParams.id).success(function(data) {
      $location.path('/status');
    })
  }
};

// 添加待办

function AddTodoCtrl($scope, $http, $location) {
  $scope.form = {};
  $http.get('/api/users').success(function(data) {
    $scope.users = data.data;
  });
  $scope.submitTodo = function() {
    $http.post('/api/todos', $scope.form).
    success(function(data) {
      if (data.error === 0) {
        $location.path('/todos');
      }
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
var AddIssueCtrl = function($scope, $http, $location) {
  $scope.form = {};
  $http.get('/api/users').success(function(data) {
    $scope.users = data.data;
  });
  $scope.submitIssue = function() {
    $http.post('/api/issues', $scope.form).success(function(data) {
      if (data['error'] === 0) {
        $location.path('/issue/' + data.data._id);
      }
    });
  }
  $scope.onpaste = function($scope, elm, attrs) {
    console.log($scope, elm, attrs);
  }
};

// 查看issue页面
var ViewIssueCtrl = function($scope, $http, $routeParams, $location) {
  var id = $routeParams.id;
  $http.get('/api/issue/' + id).success(function(data) {
    $scope.form = data.data;
  });

  $http.get('/api/issue/' + id + '/messages').success(function(data) {
    $scope.messages = data.data;
  });

  $scope.deleteIssue = function() {
    if (confirm('确定要删除么')) {
      $http.delete('/api/issue/' + id).success(function(data) {
        if (data['error'] === 0) $location.path('/issues');
      });
    }
  };
  $scope.closeIssue = function() {
    if (confirm('确定要关闭么')) {
      $http.put('/api/issue/' + id, {
        action: 'closeIssue'
      }).success(function(data) {
        console.log(data);
        $scope.form = data.data;
      });
    }
  };

  $scope.reopenIssue = function() {
    if (confirm('确定要重新开启么')) {
      $http.put('/api/issue/' + id, {
        action: 'reopenIssue'
      }).success(function(data) {
        console.log(data);
        $scope.form = data.data;
      });
    }
  };
};

var editIssueCtrl = function($scope, $http, $routeParams, $location) {
  var id = $routeParams.id;
  $http.get('/api/users').success(function(data) {
    $scope.users = data.data;
    $http.get('/api/issue/' + id).success(function(data) {
      $scope.form = data.data;
    });
  });

  $scope.submitIssue = function() {
    $http.put('/api/issue/' + id, $scope.form).success(function(data) {
      if (data.error === 0) {
        $location.path('/issue/' + id);
      }
    });
  }
}

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

  renderLine({
    "metrics": "ga:visits,ga:pageviews",
    "end-date": "2",
    "start-date": "365",
    "dimensions": "ga:week",
    "ids": "ga:62079070",
    "max-results": 366
  }, 'site-all', {
    dataTitle: ['访问次数', '页面浏览量'],
    sliceX: false
  });

  $scope.siteStartDate = daysAgo(30);
  $scope.siteEndDate = daysAgo(2);

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

  ['', 'organic', 'referral', '(none)'].forEach(function(one) {
    var option = {
      "metrics": "ga:visits",
      "end-date": "2",
      "start-date": "30",
      "dimensions": "ga:date",
      "ids": "ga:644519",
      "max-results": 366,
    };

    if (one === '(none)') {
      one = 'none';
      option.filters = 'ga:medium==(none)';
    }

    if (one === '') {

    }
    renderLine(option, 'bbs-traffic-' + one, {
      dataTitle: ['访问次数', '页面浏览量'],
      sliceX: false
    });
  });

  siteArray.forEach(function(one) {
    renderLine({
      "metrics": "ga:visits,ga:pageviews",
      "end-date": "2",
      "start-date": "30",
      "dimensions": "ga:date",
      "ids": one.ga,
      "max-results": 366
    }, 'site-traffic-' + one.name, {
      dataTitle: ['访问次数', '页面浏览量'],
      sliceX: false
    });
  });

  ['reply', 'topic', 'topic_web', 'topic_ios', 'topic_android', 'topic_wap', 'reply_web', 'reply_wap', 'reply_ios', 'reply_android'].forEach(function(one) {
    renderVisitData({
      type: 'seedit',
      api: 'http://106.3.38.38:8888/api/status.json?type=' + one,
      startTimeFormatter: function(one) {
        var start = [];
        start[0] = one[0][0].slice(0, 4);
        start[1] = one[0][0].slice(4, 6);
        start[2] = one[0][0].slice(6, 8);
        return start;
      },
      format: function(one) {}
    }, 0, '#site-' + one);
  });

  ['signup', 'signin'].forEach(function(one) {
    renderVisitData({
      type: 'seedit',
      api: 'http://106.3.38.38:8888/api/status.json?type=' + one,
      startTimeFormatter: function(one) {
        var start = [];
        start[0] = one[0][0].slice(0, 4);
        start[1] = one[0][0].slice(4, 6);
        start[2] = one[0][0].slice(6, 8);
        return start;
      },
      format: function(one) {

      }
    }, 0, '#site-' + one, {
      color: ['#b94a48'],
      lineColor: '#b94a48'
    });
  });

  $http.get('http://106.3.38.38:8888/api/app.json?type=status').success(function(data) {
    var installAll = data['stats'][0]['install_all'] + data['stats'][1]['install_all'];
    $scope.app.installAll = installAll;
  });

  $http.get('http://106.3.38.38:8888/api/app.json?type=thisWeekIosFrom').success(function(data) {
    data.stats.forEach(function(one, index) {
      data.stats[index]['data'] = data.stats[index]['data'].reduce(function(pre, next) {
        return pre + next;
      });
    });
    $scope.app.from = data.stats;
    $scope.app.fromIosSum = (function() {
      var sum = 0;
      data.stats.forEach(function(one) {
        sum += one.data
      });
      return sum;
    })();
  });

  $http.get('http://106.3.38.38:8888/api/app.json?type=thisWeekAndroidFrom').success(function(data) {
    data.stats.forEach(function(one, index) {
      data.stats[index]['data'] = data.stats[index]['data'].reduce(function(pre, next) {
        return pre + next;
      });
    });
    data.stats.sort(function(one, two) {
      if (one.data > two.data) return -1;
      return 1;
    });
    $scope.app.fromAndroid = data.stats;
    $scope.app.fromAndroidSum = (function() {
      var sum = 0;
      data.stats.forEach(function(one) {
        sum += one.data
      });
      return sum;
    })();
  });

  // 所有渠道来源

  $http.get('http://106.3.38.38:8888/api/app.json?type=allAndroidFrom').success(function(data) {
    $scope.app.allFromAndroid = data.stats;
  });

  $http.get('http://106.3.38.38:8888/api/app.json?type=allIosFrom').success(function(data) {
    $scope.app.allFromIos = data.stats;
  });

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

}

// 登录
var SigninCtrl = function($scope, $http, $location) {
  $scope.login = function() {
    $http.post('/api/signin', $scope.form).success(function(data) {
      if (data['error'] === 0) {
        $scope.hideNav = false;
        document.location.href = '/me';
        //$location.path('/me');
      }
    });
  };
};

var ViewAdCtrl = function($scope, $http) {
  // view ad data
};

// 设置
var SettingsCtrl = function($scope, $http, $timeout) {
  $http.get('/api/me/profile').success(function(data) {
    $scope.user = data.data;
  });

  $scope.updateProfile = function() {
    $http.put('/api/me/profile', $scope.user).success(function(data) {
      if (data.error === 0) {
        $scope.showSuccess = true;
        $scope.message = '更新成功鸟';
        $timeout(function() {
          $scope.showSuccess = false;
        }, 2000);
      } else {
        $scope.showFail = true;
        $scope.message = data.msg;
        $timeout(function() {
          $scope.showFail = false;
        }, 2000);
      }
    });
  }
};

var VisitDataCtrl = function($scope, $http) {
  console.log('hello');
  $http.get('/api/iData/siteRate').success(function(data) {
    $scope.data = data;
  });
};

var meCtrl = function($http, $scope) {
  // 获取消息
  $http.get('/api/me/messages').success(function(data) {
    $scope.messages = data.data;
  });
  // 获取todos
  $http.get('/api/me/todos').success(function(data) {
    $scope.todos = data.data;
  });

  // 获取issues
  $http.get('/api/me/issues').success(function(data) {
    $scope.issues = data.data;
  });
}

document.body.addEventListener("paste", function(e) {
  for (var i = 0; i < e.clipboardData.items.length; i++) {
    if (e.clipboardData.items[i].kind == "file" && e.clipboardData.items[i].type == "image/png") {
      // get the blob
      var imageFile = e.clipboardData.items[i].getAsFile();
      // read the blob as a data URL
      var fileReader = new FileReader();
      fileReader.onloadend = function(e) {
        // create an image
        //var image = document.createElement("IMG");
        //image.src = this.result;
        var html = '<img src="' + this.result + '">';
        console.log(html);
        var box = document.querySelector('#img-box');
        console.log(box)
        if (box) {
          var value = box.innerHTML;
          console.log(value);
          box.innerHTML = value + html;
        }
        /* // insert the image
        var range = window.getSelection().getRangeAt(0);
        range.insertNode(image);
        range.collapse(false);

        // set the selection to after the image
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);*/
      };
      // TODO: Error Handling!
      // fileReader.onerror = ...

      fileReader.readAsDataURL(imageFile);

      // prevent the default paste action
      e.preventDefault();

      // only paste 1 image at a time
      break;
    }
  }
});

//更改avatar
var scope = angular.element($("#avatar")).scope();
scope.$apply(function() {
  scope.avatar = 'Superhero';
});