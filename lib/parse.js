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
var fs = require('fs');
var data = require('./raw.json');
//console.log(data);
var sum = data.length;

console.log(sum);


var filter = function (filters) {
    var rs = data.filter(filters);
    return rs.length;
};


var filterAndCompress = function (filters, key) {
    var filtered = data.filter(filters);
    var final = filtered.map(function (one) {
        return  one[key];
    });
    return compressArray(final);
};

 // ios版本
var iOSVersions = filterAndCompress(function (one) {
    return one.mobileSystem === 'iOS'
}, 'mobileVersion');

// android 版本
var androidVersions = filterAndCompress(function (one) {
    return one.mobileSystem === 'Android'
}, 'mobileVersion');

// 检测方法
var methods =  filterAndCompress(function (one) {
    return true;
}, 'method');
// 问题

var problems =  filterAndCompress(function (one) {
    return  one.preExp==='检查过某症状';
}, 'instruction');


console.log('iOS版本',iOSVersions);
console.log('android版本',androidVersions);
console.log('methods',methods);
//console.log('problems',problems);

fs.writeFileSync('problems',JSON.stringify(problems,null,4));



var normal = filter(function (one) {
    return one.preExp === '正常备孕';
});


var isApple = filter(function (one) {
    return one.mobileBrand === '苹果';
});


var useHeat = filter(function (one) {
    return /基础体温/.test(one.method);
});
var use2 = filter(function (one) {
    return /排卵试纸/.test(one.method);
});

var use3 = filter(function (one) {
    return /B超/.test(one.method);
});


var all = [];

all.push(['正常备孕用户', normal]);

all.push(['苹果用户', isApple]);

all.push(['基础体温用户', useHeat]);

all.push(['排卵试纸', use2]);

all.push(['B超排卵监测', use3]);


// check out all mobile brands
var brands = data.map(function (one) {
    return one.mobileBrand;
});

// check out all mail severs

var mails = data.map(function (one) {
    return one.mail.slice(one.mail.lastIndexOf('@') + 1, one.mail.lastIndexOf('.')).replace(/vip/g, '').replace(/\./g, '').replace(/com/g, '');
});


var dates = data.map(function (one) {
    var date = new Date(one.dateline * 1000)
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if ((day + '').length === 1) {
        day = '0' + day;
    }
    return date.getFullYear() + '-' + month + '-' + day;
});

var datesRs = compressArray(dates);
var httpGet = function (url, callback) {
    var http = require('http');
    http.get(url, function (rs) {
        var data = '';
        rs.on('data', function (chunk) {
            data += chunk;
        });
        rs.on('end', function () {
            callback(data);
        });
    });
};
/*datesRs.forEach(function(one){
    var url = 'http://106.3.38.38:8004/api/datastore?type=apply&date='+one.value+'&data='+one.count;
    httpGet(url,function(data){
        //console.log(data);
    });
});*/

datesRs.sort(function (a, b) {
    if (a['value'].replace(/-/g, '') > b['value'].replace(/-/g, '')) return 1;
    return -1;
});
console.log(datesRs);

var mailsRs = compressArray(mails, 'value');
//console.log(mailsRs);


var sortBrand = compressArray(brands);
/*    sortBrand.sort(function(a,b){
 if(a.count> b.count) return -1;
 return 1;
 });*/
//console.log(sortBrand);
// 正常备孕


all.forEach(function (one) {
    one[3] = ((one[1] / sum) * 100).toFixed(2) + '%';
});

console.log(all);


var period = data.map(function (one) {
    var date = new Date(one.preTime);
    var offset = ((+new Date) - (+date)) / 1000 / 3600 / 24 / 30;
    return    Math.ceil(offset);
});


//console.log(period);
var periodRs = compressArray(period);
console.log(periodRs);

