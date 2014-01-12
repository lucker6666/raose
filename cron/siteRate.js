var config = {
    "all": "62079070",
    "bbs": "644519",
    "www": "644469",
    "event": "63911100",
    "m": "61918595",
    "i": "67437444",
    "riji": "648824",
    "zhishi": "16257208",
    "account": "74817277"
}
var httpGet = function(url, callback) {
    var http = require('http');
    http.get(url, function(rs) {
        var data = '';
        rs.on('data', function(chunk) {
            data += chunk;
        });
        rs.on('end', function() {
            callback(JSON.parse(data));
        });
    });
};

var fs = require('fs');
var datas = {};
var j = 0;
var len = Object.keys(config).length;
for (var i in config) {
    var ids = config[i];

    (function(i, ids) {
        var api = 'http://192.157.212.191:8888/api/ga.json?max-results=100&ids=ga%3A' + ids + '&dimensions=&start-date=2013-09-12&end-date=2013-10-10&metrics=ga%3AvisitBounceRate%2Cga%3AavgTimeOnSite%2Cga%3ApageviewsPerVisit%2Cga%3ApercentNewVisits';
        httpGet(api, function(data) {
            j++;
            datas[i] = (function() {
                var items = {};
                data.rows[0].forEach(function(one, index) {
                    data.rows[0][index] = (one * 1).toFixed(2);
                });
                data.columnHeaders.forEach(function(one, index) {
                    items[one.name.slice(3)] = data.rows[0][index];
                });
                console.log(items);
                return items;
            })();

            if (j === len) {
                console.log('完成了');
                console.log(datas);
                fs.writeFileSync('data/siteRate.json', JSON.stringify(datas, null, 4))
            }
            //fs.writeFileSync('data/rate/' + i + '.json', JSON.stringify(data.rows, null, 4));
        });
    })(i, ids);

}