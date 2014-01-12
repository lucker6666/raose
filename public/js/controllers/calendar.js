var ViewCalendarCtrl = function ($scope, $http) {
    $http.get('/api/calendars').success(function (data) {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            views: {
                defaultView: 'basicWeek'
            },
            defaultView: 'basicWeek',
            editable: true,
            events: data.data,
            eventResize: function (event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
                $http.put('/api/calendar/' + event._id, {start: event.start, end: event._end}, function (data) {
                    if (data.error !== 0) {
                        revertFunc();
                        alert('提交出错哦');
                    }
                });
            },
            eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {
                $http.put('/api/calendar/' + event._id, {start: event.start, end: event.end}, function (data) {
                    if (data.error !== 0) {
                        revertFunc();
                        alert('提交出错哦');
                    }
                });
            }
        });
    });
};

var AddCalendarCtrl = function ($scope, $http, $location) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    var h = date.getHours();
    var minute = date.getMinutes();

    $scope.startDate = new Date(y + '/' + m + '/' + d);
    $scope.startHour = h;
    $scope.startMinute = minute;
    $scope.submitCalendar = function () {
        var start = new Date((+new Date($scope.startDate)) + $scope.startHour * 3600000 + $scope.startMinute * 60000);
        var end;
        if ($scope.endDate) {
            var endHour = $scope.endHour || 0;
            var endMinute = $scope.endMinute || 0;
            end = new Date((+new Date($scope.endDate)) + endHour * 3600000 + endMinute * 60000);
        }
        $http.post('/api/calendars', {
            title: $scope.form.title,
            start: start,
            end: end
        }).success(function (data) {
                if (data.error !== 0) {
                    alert(data.msg);
                    return;
                }
                $location.path('/calendar');
            });
    };
};
