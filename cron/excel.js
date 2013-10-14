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

for (var i in config) {
    var ids = config[i];

    (function(i, ids) {
        httpGet('http://173.208.199.49:8888/api/ga.json?max-results=10000&ids=ga%3A' + ids + '&dimensions=ga%3Adate&start-date=2013-06-15&end-date=2013-10-11&metrics=ga%3Apageviews%2Cga%3Avisits', function(data) {
            var raw = data.rows;
            // 处理浏览量日增
            raw.forEach(function(one, index) {
                if (index > 0) {
                    var rate = (((raw[index][1] - raw[index - 1][1]) / raw[index - 1][1]) * 100).toFixed(2) + '%';
                } else {
                    rate = '0%';
                }
                one.splice(2, 0, rate);
            });

            // 处理访问次数日增
            raw.forEach(function(one, index) {
                if (index > 0) {
                    var rate = (((raw[index][3] - raw[index - 1][3]) / raw[index - 1][3]) * 100).toFixed(2) + '%';
                } else {
                    rate = '0%';
                }
                one.splice(4, 0, rate);
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
                        sum += parseInt(dataItem[1], 10);
                        sum02 += parseInt(dataItem[3], 10)
                        // 标记第一个日期
                        if (oneIndex === 0) {
                            startIndex = index;
                        }
                    }
                });
                raw[startIndex].push(Math.round(sum / 7), 0, Math.round(sum02 / 7), 0);
            });

            // 没有平均数的以0填充 
            raw.forEach(function(one, index) {
                // 和前面不为0的数比
                if (!one[5]) {
                    one[5] = '';
                    one[6] = '';
                    one[7] = '';
                    one[8] = '';
                } else {
                    var preOne = raw[index - 7];
                    if (preOne) {
                        //进行比较
                        var rate = ((one[5] - raw[index - 7][5]) / raw[index - 7][5]);
                        var rate02 = ((one[7] - raw[index - 7][7]) / raw[index - 7][7]);
                        one[6] = (rate * 100).toFixed(2) + '%';
                        one[8] = (rate02 * 100).toFixed(2) + '%';
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
            fs.writeFileSync(i + '.json', JSON.stringify(raw, null, 4));
            console.log(raw);
        });

    })(i, ids);

}