var socket = io.connect('http://106.3.38.38:8888/data');
socket.on('connect', function () {
    console.log('Client has connected to the server!');
});

// capitalise letter function
function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var routes = ['me'];
var app = angular.module('myApp', ['ngRoute']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        routes.forEach(function (one) {
            $routeProvider.when('/' + one, {
                templateUrl: 'partials/' + one,
                controller: window[capitaliseFirstLetter(one) + 'Ctrl']
            });
        });

        // index
        $routeProvider.when('/', {
            templateUrl: 'partials/me',
            controller: MeCtrl
        });

        $routeProvider.otherwise({ redirectTo: '/me' });
        $locationProvider.html5Mode(true);
    }]).
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
            time = Math.round(time);
            var minute = '0' + Math.floor(time / 60);
            var sec = '0' + time % 60;
            return minute.slice(-2) + ':' + sec.slice(-2);
        }
    }).
    filter('issueLevel', function () {
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
    });
