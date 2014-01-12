var ViewCalendarCtrl = function($scope,$http){

  $http.get('/api/calendars').success(function(data){
    		
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,basicDay'
			},
      views:{
        defaultView:'basicWeek'
      },
      defaultView:'basicWeek',
			editable: true,
			events: data.data,
      eventResize:function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
         console.log(event._end);
        $http.put('/api/calendar/'+event._id,{start:event.start,end:event._end},function(data){
          if(data.error!==0) {
            reverFunc();
            alert('提交出错哦');
          }
      });
    },
    eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {
      console.log(event);
      $http.put('/api/calendar/'+event._id,{start:event.start,end:event.end},function(data){
        console.log(data);
      });
    }
		});  
  });


		
};

var AddCalendarCtrl = function($scope,$http,$location){
  	var date = new Date();
		var d = date.getDate();
		var m = date.getMonth()+1;
		var y = date.getFullYear();
    var h = date.getHours();
    var minute = date.getMinutes();
  console.log(y+'/'+m+'/'+d)
  $scope.startDate = new Date(y+'/'+m+'/'+d);
  console.log($scope.startDate)
  $scope.startHour = h;
  $scope.startMinute = minute;
  $scope.submitCalendar = function(){
    console.log($scope.startDate,$scope.startHour,$scope.startMinute);
    var start = new Date((+new Date($scope.startDate))+$scope.startHour*3600000 + $scope.startMinute * 60000);
    console.log(start);
    $http.post('/api/calendars',{title:$scope.form.title,start:start}).success(function(data){
      if(data.error!==0){
        alert(data.msg);
        return;
      }
      $location.path('/calendar');
    });
  };
};
