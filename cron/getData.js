 var fs = require('fs');
 var httpGet = function(url, callback) {
   var http = require('http');
   http.get(url, function(rs) {
     var data = '';
     rs.on('data', function(chunk) {
       data += chunk;
     });
     rs.on('end', function() {
       callback(data);
     });
   })
 }

 httpGet('http://106.3.38.38:8888/api/app.json?type=3month_install', function(data) {
   console.log('monthly install fetched successfully');
   data = JSON.parse(data);
   fs.writeFileSync('install.json', JSON.stringify(data, null, 4))
 });
 httpGet('http://106.3.38.38:8888/api/app.json?type=3month_active', function(data) {
   console.log('monthly active fetched successfully');
   data = JSON.parse(data);
   fs.writeFileSync('active.json', JSON.stringify(data, null, 4))
 });
 httpGet('http://106.3.38.38:8888/api/app.json?type=3month_launch', function(data) {
   console.log('monthly launch fetched successfully');
   data = JSON.parse(data);
   fs.writeFileSync('launches.json', JSON.stringify(data, null, 4))
 });
 httpGet('http://106.3.38.38:8888/cache/process/status.json', function(data) {
   console.log('seedit analytics data fetched successfully');
   data = JSON.parse(data);
   fs.writeFileSync('status_all.json', JSON.stringify(data, null, 4));
 });
 var querystring = require('querystring');
 ['', 'organic', 'referral', '(none)'].forEach(function(one) {
   var option = {
     "metrics": "ga:visits",
     "end-date": "2013-10-06",
     "start-date": "2013-06-15",
     "dimensions": "ga:date",
     "ids": "ga:644519",
     "max-results": 10000,
   };

   if (one !== '') {
     option.filters = 'ga:medium==' + one;
   }

   if (one === '(none)') {
     one = 'none';
     option.filters = 'ga:medium==(none)';
   }

   var API = 'http://106.3.38.38:8888/api/ga.json?' + querystring.stringify(option);

   (function(one) {
     httpGet(API, function(data) {
       console.log('bbs_' + one + ' install fetched successfully');
       data = JSON.parse(data);
       fs.writeFileSync('bbs_' + one + '.json', JSON.stringify(data['rows'], null, 4));
     });
   })(one);

 });