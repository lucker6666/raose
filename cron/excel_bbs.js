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
 };

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
 };

 var all = require('./bbs_.json');
 var bbs01 = require('./bbs_organic.json');
 var bbs02 = require('./bbs_none.json');
 var bbs03 = require('./bbs_referral.json');
 var datas = [];

 all.forEach(function(one, index) {
   datas.push([all[index][0], all[index][1] * 1, '0%', 0, '0%', bbs01[index][1] * 1, '0%', 0, '0%', bbs02[index][1] * 1, '0%', 0, '0%', bbs03[index][1] * 1, '0%', 0, '0%']);
 });

 //console.log(datas[0].length);
 var raw = datas;

 // 处理全部
 raw.forEach(function(one, index) {
   //console.log(raw[index][1]);
   if (index > 0) {
     var rate = (((raw[index][1] - raw[index - 1][1]) / raw[index - 1][1]) * 100).toFixed(2) + '%';
   } else {
     rate = '0%';
   }
   //console.log(rate);
   one[2] = rate;
 });

 // 处理
 raw.forEach(function(one, index) {
   if (index > 0) {
     var rate = (((raw[index][5] - raw[index - 1][5]) / raw[index - 1][5]) * 100).toFixed(2) + '%';
   } else {
     rate = '0%';
   }
   one[6] = rate;
 });

 // 处理
 raw.forEach(function(one, index) {
   if (index > 0) {
     var rate = (((raw[index][9] - raw[index - 1][9]) / raw[index - 1][9]) * 100).toFixed(2) + '%';
   } else {
     rate = '0%';
   }
   one[10] = rate;
 });

 // 处理
 raw.forEach(function(one, index) {
   if (index > 0) {
     var rate = (((raw[index][13] - raw[index - 1][13]) / raw[index - 1][13]) * 100).toFixed(2) + '%';
   } else {
     rate = '0%';
   }
   one[14] = rate;
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
 });

 // 没有平均数的以0填充 
 raw.forEach(function(one, index) {
   // 和前面不为0的数比
   if (!one[3]) {
     one[3] = '';
     one[4] = '';
     one[7] = '';
     one[8] = '';
     one[11] = '';
     one[12] = '';
     one[15] = '';
     one[16] = '';
   } else {
     var preOne = raw[index - 7];
     if (preOne) {
       //进行比较
       var rate = (((one[3] - raw[index - 7][3]) / raw[index - 7][3]) * 100).toFixed(2);
       var rate02 = (((one[7] - raw[index - 7][7]) / raw[index - 7][7]) * 100).toFixed(2);
       var rate03 = (((one[11] - raw[index - 7][11]) / raw[index - 7][11]) * 100).toFixed(2);
       var rate04 = (((one[15] - raw[index - 7][15]) / raw[index - 7][15]) * 100).toFixed(2);

       one[4] = rate + '%';
       one[8] = rate02 + '%';
       one[12] = rate03 + '%';
       one[16] = rate04 + '%';

       //one[6] = (rate * 100).toFixed(2) + '%';
       //one[8] = (rate02 * 100).toFixed(2) + '%';
     }
   }
 });
 // 倒序
 raw.reverse();
 //console.log(dates);
 // 数字部分转换成数字 

 raw.forEach(function(one) {
   one[1] *= 1;
   one[3] *= 1;
 });
 var fs = require('fs');
 //fs.writeFileSync(i + '.json', JSON.stringify(raw, null, 4));
 console.log(raw);

 fs.writeFileSync('allbbs_parse.json', JSON.stringify(raw, null, 4));