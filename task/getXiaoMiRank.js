var $ = require('jquery');
var request = require('restler');
//console.log(request);
request.get('http://app.xiaomi.com/catTopList/14',{headers:{'User-Agent':"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.72 Safari/537.36"}}).on('complete',function(data){
  console.log(data);
  //var $dom = $(data);
  //console.log($dom);
  //var $ul = $dom.find('.applist.app-push');
  //console.log($ul);
});
//onsole.log($);