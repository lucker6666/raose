 var fs = require('fs');
 // 日期格式化
 var format = function(date) {
   var month = (date.getMonth() + 1) + '',
     day = date.getDate() + '',
     rs = date.getFullYear() + '-' + (month.length === 1 ? '0' + month : month) + '-' + (day.length === 1 ? '0' + day : day);
   return rs;
 };
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

 // 取得几天前数据 
 var daysAgo = function(day, date, isFormat) {
   var today;
   if (date) {
     today = +new Date(date);
   } else {
     today = +new Date();
   }
   var offset = day * 24 * 3600 * 1000;
   if (isFormat && isFormat === false) return new Date(today - offset);
   return format(new Date(today - offset));
 };

 httpGet('http://106.3.38.38:8888/api/app.json?type=3month_install', function(data) {
   console.log('monthly install fetched successfully');
   console.log(data);
   fs.writeFileSync('install.json', JSON.stringify(data, null, 4))
 });
 httpGet('http://106.3.38.38:8888/api/app.json?type=3month_active', function(data) {
   console.log('monthly active fetched successfully');
   fs.writeFileSync('active.json', JSON.stringify(data, null, 4))
 });
 httpGet('http://106.3.38.38:8888/api/app.json?type=3month_launch', function(data) {
   console.log('monthly launch fetched successfully');
   fs.writeFileSync('launches.json', JSON.stringify(data, null, 4))
 });
 httpGet('http://106.3.38.38:8888/cache/process/status.json', function(data) {
   console.log('seedit analytics data fetched successfully');
   fs.writeFileSync('status_all.json', JSON.stringify(data, null, 4));
 });
 var querystring = require('querystring');
 ['', 'organic', 'referral', '(none)'].forEach(function(one) {
   var option = {
     "metrics": "ga:visits",
     "end-date": daysAgo(2),
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

   var API = 'http://173.208.199.49:8888/api/ga.json?' + querystring.stringify(option);

   (function(one) {
     httpGet(API, function(data) {
       console.log('bbs_' + one + ' install fetched successfully');
       fs.writeFileSync('bbs_' + one + '.json', JSON.stringify(data['rows'], null, 4));
     });
   })(one);

 });