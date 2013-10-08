 var getNearestDay = function(day, d, doFormat) {
   d = d || new Date();
   d = new Date(d);
   var nowDay = d.getDay();
   if (nowDay > day) {
     d.setDate(d.getDate() - nowDay + day);
   } else {
     d.setDate(d.getDate() - (nowDay + (7 - day)));
   }
   // 格式化的
   if (doFormat && doFormat === true) {
     return format(d);
   }
   return d;
 }

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

 var getWeekDate = function(startDate) {
   var date = [];
   var endDate = getNearestDay(5, new Date);
   date.push(endDate);
   while (+new Date(endDate) >= +new Date(startDate)) {
     endDate = getNearestDay(5, endDate);
     date.push(endDate);
   };
   return date;
 }

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

 var tmpData = require('./status_all.json');
 var datas = (function() {
   var rs = tmpData.map(function(one) {
     return [one.date, one.topic, 0, 0, 0, one.topic_web, 0, 0, 0, one.topic_ios, 0, 0, 0, one.topic_android, 0, 0, 0, one.reply, 0, 0, 0, one.topic_web, 0, 0, 0, one.reply, 0, 0, 0, one.reply_android, 0, 0, 0, one.reply_wap, 0, 0, 0, one.reply_ios, 0, 0, 0, one.reply_web, 0, 0, 0, one.blog, 0, 0, 0, one.signup, 0, 0, 0, one.signin, 0, 0, 0, ];
   });
   return rs;
 })();

 //console.log(datas[0].length);
 var raw = datas;

 [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49].forEach(function(number) {
   raw.forEach(function(one, index) {
     if (index > 0) {
       var rate = (((raw[index][number] - raw[index - 1][number]) / raw[index - 1][number]) * 100).toFixed(2) + '%';
     } else {
       rate = '0%';
     }
     one[number + 1] = rate;
   });
 });

 // 处理周数据
 // 获取每个周期最后一天数据
 var dates = getWeekDate(new Date('2013/06/15'));
 var indexArray = [];
 // 根据日期遍历
 dates.forEach(function(one, index) {
   var date = [];
   for (var i = 0; i <= 6; i++) {
     date.push(daysAgo(i, one, false));
   }

   date = date.map(function(one) {
     return one.replace(/-/g, '');
   });
   var sum = 0;
   var sum02 = 0;
   var sum03 = 0;
   var sum04 = 0;
   var sum05 = 0;
   var sum06 = 0;
   var sum07 = 0;
   var sum08 = 0;
   var sum09 = 0;
   var sum10 = 0;
   var sum11 = 0;
   var sum12 = 0;
   var sum13 = 0;
   var startIndex = 0;
   // 遍历一个周期内的数据
   date.forEach(function(one, oneIndex) {
     //console.log(oneIndex);
     // 取得特定日期的数据
     var dataItem = raw.filter(function(two) {
       return two[0] === one;
     });

     if (dataItem.length) {
       // 取得当前在raw中的index
       var index = (function() {
         return raw.indexOf(dataItem[0]);
       })();
       var dataItem = dataItem[0];
       sum += Math.round(parseInt(dataItem[1], 10));
       sum02 += Math.round(parseInt(dataItem[5], 10));
       sum03 += Math.round(parseInt(dataItem[9], 10));
       sum04 += Math.round(parseInt(dataItem[13], 10));
       sum05 += Math.round(parseInt(dataItem[17], 10));
       sum06 += Math.round(parseInt(dataItem[21], 10));
       sum07 += Math.round(parseInt(dataItem[25], 10));
       sum08 += Math.round(parseInt(dataItem[29], 10));
       sum09 += Math.round(parseInt(dataItem[33], 10));
       sum10 += Math.round(parseInt(dataItem[37], 10));
       sum11 += Math.round(parseInt(dataItem[41], 10));
       sum12 += Math.round(parseInt(dataItem[45], 10));
       sum13 += Math.round(parseInt(dataItem[49], 10));

       // 标记第一个日期
       if (oneIndex === 0) {
         startIndex = index;
       }
     }
   });
   //raw[startIndex].push(Math.round(sum / 7), 0, Math.round(sum02 / 7), 0);
   //raw[startIndex].splice(3, 0, sum, '未计算');
   //console.log(sum);
   raw[startIndex][3] = Math.round(sum / 7);
   raw[startIndex][7] = Math.round(sum02 / 7);
   raw[startIndex][11] = Math.round(sum03 / 7);
   raw[startIndex][15] = Math.round(sum04 / 7);
   raw[startIndex][19] = Math.round(sum05 / 7);
   raw[startIndex][23] = Math.round(sum06 / 7);
   raw[startIndex][27] = Math.round(sum07 / 7);
   raw[startIndex][31] = Math.round(sum08 / 7);
   raw[startIndex][35] = Math.round(sum09 / 7);
   raw[startIndex][39] = Math.round(sum10 / 7);
   raw[startIndex][43] = Math.round(sum11 / 7);
   raw[startIndex][47] = Math.round(sum12 / 7);
   raw[startIndex][51] = Math.round(sum13 / 7);

   /*[3, 7, 11, 15, 19, 23, 27, 31, 35].forEach(function(number) {

   });*/
 });

 // 没有平均数的以0填充 
 raw.forEach(function(one, index) {
   // 和前面不为0的数比
   if (!one[3]) {
     /*  one[3] = '';
     one[4] = '';
     one[7] = '';
     one[8] = '';
     one[11] = '';
     one[12] = '';
     one[15] = '';
     one[16] = '';*/
     [3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 36, 39, 40, 43, 44, 47, 48, 51, 52].forEach(function(number) {
       one[number] = '';
     });
   } else {
     var preOne = raw[index - 7];
     if (preOne) {
       //进行比较
       [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51].forEach(function(number) {
         var rate = (((one[number] - raw[index - 7][number]) / raw[index - 7][number]) * 100).toFixed(2);
         one[number + 1] = rate + '%';
       });
     }
   }
 });
 // 倒序
 raw.reverse();
 // 数字部分转换成数字 
 raw.forEach(function(one) {
   one[1] *= 1;
   one[3] *= 1;
 });
 var fs = require('fs');
 console.log(raw);
 fs.writeFileSync('allsite_parse.json', JSON.stringify(raw, null, 4));