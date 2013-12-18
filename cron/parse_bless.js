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

var $5daysAgo = getTimeByDay(5) / 1000;

 Get('http://common.seedit.com/tools/bless.json?time=' + $5daysAgo + '&limit=2000000', function (data) {
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
 var querystring = require('querystring');
 compress.forEach(function (one, index) {
 // var url = 'http://172.16.5.96:8004/api/datastore?type=bless&date=' + one.value + '&data=' + one.count;
 // console.log(url);
 var data = {
 type: 'bless',
 date: one.value,
 data: [one.count, compress1[index]['count'], compress2[index]['count']]
 };

 console.log(data);
 Get('http://172.16.5.96:8004/api/datastore?' + querystring.stringify(data), function (data) {
 console.log(data)
 });
 });
 };

var filterAndCompress = function (data, filter, map) {


    if (filter) {
        data = data.filter(filter);
    }

    if (map) {
        data = data.map(map);
    }

    return compressArray(data);
};
console.log('-----------割一下-------------');
console.log('统计数据为前端打点统计，存在部分数据丢失问题，比例相对比较低。');
console.log('下面数据为周六一天的完整数据,待周二来分析周一的数据可能比较准确');
// 计算每人次数
// 计算总消耗金豆
// 计算最常用贡品
var percent = function (no) {
    return (no * 100).toFixed(2) + '%';
};


var startDate = '2013-12-13';
var endDate = '2013-12-19';
Get('http://106.3.38.38:8004/api/trackdata.json?action=Miao%20xiang&start-date='+startDate+'&end-date='+endDate+'', function (data) {
    data = JSON.parse(data);
    var sum = data.sum;
    data = data.data;
    // console.log(data);

    //console.log(sum);

    var uids = filterAndCompress(data, null, function (one) {
        return    one.uid;
    });

    var feeds = filterAndCompress(data, null, function (one) {
        return one.actionDetails.data.replace(/[a-z=&]/g, '');
    });


    var values = filterAndCompress(data, null, function (one) {
        var datas = one.actionDetails.data.replace(/[a-z=&]/g, '').split('');
        //console.log(datas);
        var count = datas[0] * 5 + datas[1] * 10 + datas[2] * 10 + datas[3] * 10 + datas[4] * 20;
        //console.log(count);
        return count;

    });


    var count = (function () {
        var no = 0;
        values.forEach(function (one) {
            no += one.value * one.count;
        });
        return no;
    })();
    console.log('------------------------');
    console.log('共有', sum, '人次上香');
    console.log('单用户最高上香次数', uids[0].count, '次，uid为', uids[0].value);
    console.log('她们喜欢的贡品组合是', feeds[0].value, '，计', feeds[0].count, '次', '占', percent(feeds[0].count/sum));
    console.log('大部分人消耗', values[0].value, '金豆');
    console.log('当天消耗金豆数量为', count);


    //console.log(uids);
    //console.log(feeds);
    //console.log(values);
});




Get('http://106.3.38.38:8004/api/trackdata.json?action=Miao%20give&start-date='+startDate+'&end-date='+endDate+'', function (data) {
    data = JSON.parse(data);
    var sum = data.sum;
    data = data.data;




    var nos = filterAndCompress(data, null, function (one) {
        return    one.actionDetails.no;
    });



    var nosSum = (function () {
        var no = 0;
        nos.forEach(function (one) {
            no += one.value * one.count;
        });
        return no;
    })();

    console.log('------------------------');
    console.log('共有', sum, '次捐功德');
    console.log('单次捐功德最多人捐了', nos[0].value, '金豆，计', nos[0].count, '占', percent(nos[0].count / sum));
    console.log('单次捐功德第二多人捐了', nos[1].value, '金豆，计', nos[1].count, '占', percent(nos[1].count / sum));
    console.log('单次捐功德第三多人捐了', nos[2].value, '金豆，计', nos[2].count, '占', percent(nos[2].count / sum));
     nos.sort(function(a,b){
         if(a.value*1> b.value*1){
             return -1;
         }
         return 1;
     });

    console.log('某土豪用户一次捐了',nos[0].value);
    console.log('单日捐功德数为', nosSum);
    //console.log(nos);


});



Get('http://106.3.38.38:8004/api/datastore/export?type=bless', function (data) {
    data = JSON.parse(data);
    var one = data.rows[data.rows.length-3];

   var first =  data.rows[data.rows.length-4];
   var two =  data.rows[data.rows.length-5];
    data = data.rows;
    console.log('------------------------');
    console.log('上线前一天共产生了',two[1],'条愿望，其中许愿',two[2],'条','还愿',two[3],'条');
    console.log('上线当天共产生了',first[1],'条愿望，其中许愿',first[2],'条','还愿',first[3],'条');
    console.log('周六共产生了',one[1],'条愿望，其中许愿',one[2],'条','还愿',one[3],'条');

    console.log('一个月内愿望数趋势如下，对应[日期，全部愿望数，许愿数，还愿数],上线日期为 2013-12-13');
    console.dir(data);
    // console.log(nos);

});



Get('http://106.3.38.38:8004/api/trackdata.json?action=Miao%20share&start-date='+startDate+'&end-date='+endDate+'', function (data) {
    data = JSON.parse(data);
    var sum = data.sum;
    data = data.data;
    console.log('------------------------');
    console.log('当天尝试分享到微博的人次有',sum,'人');
    var success = (function(){
        var no = 0;
        data.forEach(function(one){
            if(one.actionDetails.type==='success')
                no ++;
        });
        return no;
    })();

    var error = (function(){
        var no = 0;
        data.forEach(function(one){
            if(one.actionDetails.type==='error')
                no ++;
        });
        return no;
    })();
    console.log('分享成功的人次有',success,'人');
   // console.log('分享失败的人次有',error,'人');

    var notbind = (function(){
        var no = 0;
        data.forEach(function(one){
            if(one.actionDetails.type==='error' && one.actionDetails.message==='用户未绑定')
                no ++;
        });
        return no;
    })();

    var expire = (function(){
        var no = 0;
        data.forEach(function(one){
            if(one.actionDetails.type==='error' && one.actionDetails.message==='请重新登录')
                no ++;
        });
        return no;
    })();
    console.log('失败的原因::用户未绑定',notbind,'人');
    console.log('失败的原因::新浪授权过期',expire,'人');

});






console.log('------------------------');
console.log('如何赚金豆按钮点击为 [周五:374,周六：291]');
