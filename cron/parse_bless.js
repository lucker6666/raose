/**
 * Created by lizheng on 13-12-14.
 */

/**
 * http get library
 *
 */

var Get = function (url, callback) {
    var http = require('http');
    http.get(url, function (rs) {
        var data = '';
        rs.on('data', function (chunk) {
            data += chunk;
        });
        rs.on('end', function () {
            callback(data);
        });
    })
};


function compressArray(original, sort) {
    var compressed = [];
    // make a copy of the input array
    var copy = original.slice(0);
    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {
        var myCount = 0;
        // loop over every element in the copy and see if it's the same
        for (var w = 0; w < copy.length; w++) {
            if (original[i] == copy[w]) {
                // increase amount of times duplicate is found
                myCount++;
                // sets item to undefined
                delete copy[w];
            }
        }
        if (myCount > 0) {
            var a = new Object();
            a.value = original[i];
            a.count = myCount;
            compressed.push(a);
        }
    }

    sort = sort || 'count';

    if (sort === 'count') {
        return compressed.sort(function (a, b) {
            if (a[sort] > b[sort]) return -1;
            return 1;
        });
    } else {
        return compressed.sort(function (a, b) {
            if (a[sort].replace(/-/g, '') > b[sort].replace(/-/g, '')) return -1;
            return 1;
        });
    }

}

var getTimeByDay = function (day) {
    return (+new Date) - day * 24 * 3600 * 1000;
};

var $5daysAgo = getTimeByDay(4) / 1000;
Get('http://common.seedit.com/tools/bless.json?time=' + $5daysAgo + '&limit=20000', function (data) {
    data = JSON.parse(data);
    getTrend(data.data.data);
});


var getTrend = function (data) {
    var dates = data.map(function (one) {
        return one.time.slice(0, 10);
    });

    var dates1 = data.filter(function (one) {
        return one.type === 1;
    }).map(function (one) {
            return one.time.slice(0, 10);
        });

    var dates2 = data.filter(function (one) {
        return one.type === 2;
    }).map(function (one) {
            return one.time.slice(0, 10);
        });

    var compress = compressArray(dates, 'value');
    var compress1 = compressArray(dates1, 'value');
    var compress2 = compressArray(dates2, 'value');
    console.log(compress);
    console.log(compress1);
    console.log(compress2);
};




