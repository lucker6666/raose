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
   data = JSON.parse(data);
   fs.writeFileSync('install.json', JSON.stringify(data, null, 4))
 });
 httpGet('http://106.3.38.38:8888/api/app.json?type=3month_active', function(data) {
   data = JSON.parse(data);
   fs.writeFileSync('active.json', JSON.stringify(data, null, 4))
 });
 httpGet('http://106.3.38.38:8888/api/app.json?type=3month_launch', function(data) {
   data = JSON.parse(data);
   fs.writeFileSync('launches.json', JSON.stringify(data, null, 4))
 });