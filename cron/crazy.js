var fs = require('fs');
var httpGet = function (url, callback) {
    var http = require('http');
    http.get(url, function (rs) {
        var data = '';
        rs.on('data', function (chunk) {
            data += chunk;
        });
        rs.on('end', function () {
            callback(JSON.parse(data));
        });
    });
};

function compressArray(original) {
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
    return compressed;
}

var sum;
httpGet('http://106.3.38.38:8004/api/exports/crazy', function (data) {
    sum = data.data.length;
    var rs = [];
    data.data.forEach(function (one) {
        rs.push(one.date.slice(0, 10));
    });

    var a = compressArray(rs);
    a.sort(function (a, b) {
        if (a.value.replace(/-/g, '') > b.value.replace(/-/g, '')) {
            return 1;
        }
        return -1;
    });
   var final =a.map(function(one){
       return [one.value,one.count];
   });
});