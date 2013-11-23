const IP = localStorage.getItem('server') || '106.3.38.38';
const API = 'http://' + IP + ':8888';

var buildFilter = function(key, equal) {
	var equalString = (typeof equal === 'undefined') ? '==' : equal;

	var keys = key.split('/');
	keys[2] && keys[2].indexOf('@') !== -1 && (function() {
		console.log('with @');
		keys[2] = keys[2].replace('@', '');
		equalString = '=@';
	})();
	var filters = 'ga:eventCategory==' + keys[0];
	filters += ';ga:eventAction==' + keys[1];
	metrics = 'ga:totalEvents'
	if (keys[2]) {
		if ((keys[2].indexOf('-') !== -1 && keys[2].indexOf('jpg') === -1) || keys[2].indexOf('domain') !== -1) {
			keys[2] = removeSubDomain(keys[2]);
			if (keys[2] !== '') {
				filters += ';ga:eventLabel' + equalString + keys[2];
			}
		} else if (keys[2].indexOf('@') !== -1) {
			console.log('with @');
			filters += ';ga:eventLabel' + '=@' + keys[2];
		} else {
			filters += ';ga:eventLabel' + equalString + keys[2];
		}
	}
	console.log(filters);
	return filters;
}

// 获取随机颜色

	function get_random_color() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.round(Math.random() * 15)];
		}
		return color;
	}

	// 圆饼图渲染

	function render_pie(data, id, title) {

		new iChart.Pie2D({
			render: id,
			data: data,
			title: title,
			background_color: '#fafafa',
			legend: {
				enable: true
			},
			border: {
				enable: false
			},
			sub_option: {
				label: {
					background_color: null,
					sign: false, //设置禁用label的小图标
					padding: '0 4',
					border: {
						enable: false,
						color: '#666666'
					},
					fontsize: 11,
					fontweight: 600,
					color: '#4572a7',
					text: 'haha'
				},
				border: {
					width: 2,
					color: '#ffffff'
				}
			},
			animation: true,
			showpercent: true,
			decimalsnum: 2,
			width: 960,
			height: 400,
			radius: 140
		}).draw();
	}

	// 过滤器生成
var removeSubDomain = function(key) {
	return key.replace('-www', '')
		.replace('-bbs', '')
		.replace('-riji', '')
		.replace('-i', '')
		.replace('-tool', '')
		.replace('-zhishi', '')
		.replace('/{domain}', '')
		.replace('{domain}', '');
}

// 事件统计图生成
var renderEventData = function(key, id, title) {
	var eventOption = {
		'ids': 'ga:63911100',
		'dimensions': 'ga:date',
		'metrics': 'ga:totalEvents',
		'start-date': oneMonthAgo,
		'end-date': now,
		'filters': buildFilter(key, '=@'),
		'max-results': 100
	};

	$.get(API + '/api/ga.json?' + $.param(eventOption), function(data) {
		var datas = data.rows;
		var x = datas.map(function(one) {
			return one[0].slice(-2);
		});
		var y = datas.map(function(one) {
			return one[1];
		});

		var data = [{
			name: 'PV',
			value: y,
			color: '#EA578C',
			line_width: 1
		}];

		var labels = x;
		var chart = new iChart.LineBasic2D({
			render: id,
			data: data,
			align: 'center',
			border: {
				enable: false
			},
			title: {
				text: key,
				font: '微软雅黑',
				fontsize: 20,
				color: '#000',
				fontweight: 'normal'
			},
			/*subtitle : {
					text:'14:00-16:00访问量达到最大值',
					font : '微软雅黑',
					color:'#b4b4b4'
				},*/
			/*footnote : {
					text:'ichartjs.com',
					font : '微软雅黑',
					fontsize:11,
					fontweight:600,
					padding:'0 28',
					color:'#b4b4b4'
				},*/
			width: 900,
			height: 250,
			shadow: false,
			shadow_color: '#202020',
			shadow_blur: 8,
			shadow_offsetx: 0,
			shadow_offsety: 0,
			background_color: '#fafafa',
			tip: {
				enable: true,
				shadow: true,
				listeners: {
					//tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
					parseText: function(tip, name, value, text, i) {
						return "<span style='color:#005268;font-size:12px;'>" + labels[i] + "日  " +
							"</span><span style='color:#005268;font-size:20px;'>" + value + "</span>";
					}
				}
			},
			crosshair: {
				enable: true,
				line_color: '#ec4646'
			},
			sub_option: {
				smooth: true,
				label: false,
				hollow: false,
				hollow_inside: false,
				point_size: 8
			},
			coordinate: {
				width: 800,
				height: 180,
				striped_factor: 0.18,
				grid_color: '#ececec',
				axis: {
					color: '#ececec',
					width: [0, 0, 1, 0]
				},
				scale: [{
					position: 'left',
					//start_scale: 0,
					//end_scale: end_scale,
					//scale_space: 10,
					//scale_size: 2,
					//scale_share: 5,
					//scale_enable: false,
					label: {
						color: '#9d987a',
						font: '微软雅黑',
						fontsize: 11

					},
					scale_color: '#9f9f9f'
				}, {
					position: 'bottom',
					label: {
						color: '#9d987a',
						font: '微软雅黑',
						fontsize: 6,
						'-webkit-transform': 'rotate(-45deg)'
					},
					scale_enable: false,
					labels: labels
				}]
			}
		});
		//利用自定义组件构造左侧说明文本
		chart.plugin(new iChart.Custom({
			drawFn: function() {
				//计算位置
				//var coo = chart.getCoordinate(),
				//	x = coo.get('originx'),
				//	y = coo.get('originy'),
				//	w = coo.get('width'),
				//	h = coo.get('height');
				//在左上侧的位置，渲染一个单位的文字
				//chart.target.textAlign('start')
				//.textBaseline('bottom')
				//.textFont('1 12px Arial')
				//.fillText('访问量(万)',x-40,y-12,false,'#9d987a')
				//.textBaseline('top')
				//.fillText('(时间)',x+w+12,y+h+10,false,'#9d987a');

			}
		}));
		//开始画图
		chart.draw();
	});

}

// 曲线图生成
var render_line = function(data, id, title, avg, showAll) {
	var datas = data.rows;
	var x = datas.map(function(one) {
		return one[0].slice(-2);
	});
	var y = datas.map(function(one) {
		return one[1];
	});

	var all = y.reduce(function(pre, cur) {
		return pre * 1 + cur * 1;
	})
	var ava = all / y.length;
	ava = parseInt(ava, 10);

	//console.log(ava)

	var data = [{
		name: 'PV',
		value: y,
		color: '#EA578C',
		line_width: 1
	}];

	var labels = x;
	var chart = new iChart.LineBasic2D({
		render: id,
		data: data,
		align: 'center',
		border: {
			enable: false
		},
		title: {
			text: title,
			font: '微软雅黑',
			fontsize: 20,
			color: '#000',
			fontweight: 'normal'
		},
		subtitle: {
			text: (showAll ? '总共:' + all : '') + (avg ? '平均:' + ava : ''),
			font: 'Arial',
			color: '#b4b4b4',
			fontweight: 'normal'
		},
		/*footnote : {
					text:'ichartjs.com',
					font : '微软雅黑',
					fontsize:11,
					fontweight:600,
					padding:'0 28',
					color:'#b4b4b4'
				},*/
		width: 900,
		height: 250,
		shadow: false,
		shadow_color: '#202020',
		shadow_blur: 8,
		shadow_offsetx: 0,
		shadow_offsety: 0,
		background_color: '#fafafa',
		tip: {
			enable: true,
			shadow: true,
			listeners: {
				//tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
				parseText: function(tip, name, value, text, i) {
					return "<span style='color:#005268;font-size:12px;'>" + labels[i] + "号<br/>" +
						"</span><span style='color:#005268;font-size:20px;'>" + value + "</span>";
				}
			}
		},
		crosshair: {
			enable: true,
			line_color: '#ec4646'
		},
		sub_option: {
			smooth: true,
			label: false,
			hollow: false,
			hollow_inside: false,
			point_size: 8
		},
		coordinate: {
			width: 800,
			height: 100,
			striped_factor: 0.18,
			grid_color: '#ececec',
			axis: {
				color: '#ececec',
				width: [0, 0, 1, 0]
			},
			scale: [{
				position: 'left',
				label: {
					color: '#9d987a',
					font: '微软雅黑',
					fontsize: 11
				},
				scale_color: '#9f9f9f'
			}, {
				position: 'bottom',
				label: {
					color: '#9d987a',
					font: 'Arial',
					fontsize: 6,
					'-webkit-transform': 'rotate(-45deg)'
				},
				scale_enable: false,
				labels: labels
			}]
		}
	});
	//利用自定义组件构造左侧说明文本
	chart.plugin(new iChart.Custom({
		drawFn: function() {
			//计算位置
			var coo = chart.getCoordinate(),
				x = coo.get('originx'),
				y = coo.get('originy'),
				w = coo.get('width'),
				h = coo.get('height');
			//在左上侧的位置，渲染一个单位的文字
			chart.target.textAlign('start')
				.textBaseline('bottom')
				.textFont('1 12px Arial')
			//.fillText('访问量(万)',x-40,y-12,false,'#9d987a')
			.textBaseline('top')
				.fillText('(时间)', x + w + 12, y + h + 8, false, '#9d987a');
		}
	}));
	//开始画图
	chart.draw();
}

$(function() {
	// ie 浏览器版本
	var ieOption = {
		'ids': 'ga:62079070',
		'start-date': oneMonthAgo,
		'end-date': now,
		'dimensions': 'ga:browserVersion',
		'metrics': 'ga:visitors',
		'filter': 'ga:browser =@Internet',
		'max-results': 10,
		'sort': '-ga:visitors'
	}

	// 浏览器分布
	var bsOption = {
		'ids': 'ga:62079070',
		'start-date': oneMonthAgo,
		'end-date': now,
		'dimensions': 'ga:browser',
		'metrics': 'ga:visitors',
		'max-results': 10,
		'sort': '-ga:visitors'
	};

	/*	$.get(API + '/api/ga.json?' + $.param(ieOption), function(datas) {
		var data = datas.rows.map(function(one) {
			return {
				name: one[0],
				value: one[1],
				color: get_random_color()
			}
		});
		render_pie(data, 'ie-map', '一个月内IE浏览器版本')
	})

	$.get(API + '/api/ga.json?' + $.param(bsOption), function(datas) {
		var data = datas.rows.map(function(one) {
			return {
				name: one[0],
				value: one[1],
				color: get_random_color()
			}
		});
		render_pie(data, 'bs-map', '一个月内浏览器分布')
	})
*/
	/*io.configure('development', function(){
  io.set('transports', ['xhr-polling']);
});*/

	/*$.post('http://tongji.baidu.com/web/2569732/ajax/post','name=http%3A%2F%2Fwww.trylist.com&domainId=3831222425296299745&viewType=domain&siteId=2438367&st=1364140800000&et=1364659200000&indicators=pv_count%2Cvisitor_count%2Cip_count%2Cbounce_ratio%2Cavg_visit_time&reportId=13&method=source%2Flink%2Ftop',function(data){console.log(data)});

// 按URL获取来源数据

$.post('http://tongji.baidu.com/web/2569732/ajax/post','viewType=url&siteId=2438367&st=1364140800000&et=1364659200000&indicators=pv_count%2Cvisitor_count%2Cip_count%2Cbounce_ratio%2Cavg_visit_time&order=pv_count%2Cdesc&offset=0&reportId=13&method=source%2Flink%2Fa',function(data){
	console.log(data)

	console.log(Object.keys(data.item))
},'json')*/

	$(function() {
		$(document).on('click', 'ol>li>a', function(e) {
			e.preventDefault();
			chrome.tabs.create({
				url: $(this).attr('href')
			});
		});
	});

	/*
	$(function() {
		$.ajax({
			url: 'http://172.16.5.133/zentao/my-task.json',
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				var list = JSON.parse(data.data),
					html = Mustache.render('{{#tasks}}<li><span>指派时间：{{assignedDate}}</span><br/><span style="color:black;font-weight:bold;">{{name}}</span></li>{{/tasks}}', list);
				$('#list').html(html);
			}
		})
	})

	$(function() {
		$.ajax({
			url: 'http://172.16.5.133/zentao/my-task-finishedby.json',
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				var list = JSON.parse(data.data),
					html = Mustache.render('{{#tasks}}<li><span>指派时间：{{assignedDate}}</span><br/><span style="color:black;font-weight:bold;">{{name}}</span></li>{{/tasks}}', list);
				$('#done-list').html(html);
			}
		})
	})

	$(function() {
		$.ajax({
			url: 'http://172.16.5.133/zentao/my-todo-all.json',
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				var list = JSON.parse(data.data),
					html = Mustache.render('{{#todos}}<li><span>指派时间：{{assignedDate}}</span><br/><span style="color:black;font-weight:bold;">{{name}}</span></li>{{/todos}}', list);
				$('#todo-list').html(html);
			}
		})
	})*/

	/**
	 * if current user is me
	 */
	var isHost = function() {
		var username = localStorage.getItem('user');
		if (username === 'airyland') {
			return true;
		}
		return false;
	}

	var map = {
		'source_by_domain': 'viewType=domain&siteId=2438367&st=1364140800000&et=1365495186953&st2=&et2=&indicators=pv_count%2Cvisitor_count%2Cip_count%2Cbounce_ratio%2Cavg_visit_time&order=pv_count%2Cdesc&offset=0&pageSize=100&reportId=13&method=source%2Flink%2Fa',
		'source_by_url': 'viewType=url&siteId=2438367&st=1364140800000&et=1365495186953&st2=&et2=&indicators=pv_count%2Cvisitor_count%2Cip_count%2Cbounce_ratio%2Cavg_visit_time&order=pv_count%2Cdesc&offset=0&reportId=13&method=source%2Flink%2Fa',
	}

		function renderOffset(time) {
			var minutes = Math.floor(time / 60),
				seconds = Math.ceil(time - 60 * minutes);
			if ((minutes + '').length === 1) {
				minutes = '0' + minutes;
			}
			if ((seconds + '').length === 1) {
				seconds = '0' + seconds;
			}

			return '00:' + minutes + ':' + seconds
		}

		function getBaiduAna(data) {
			$.post('http://tongji.baidu.com/web/2569732/ajax/post', data, function(data) {
				var datas = {};
				datas.data = renderSourceByDomain(data);
				var template = $('#source-template').val();
				var html = Mustache.render(template, datas);
				$('#source-body').html(html);
			}, 'json')
		}

		function getBaiduAna2(data) {
			$.post('http://tongji.baidu.com/web/2569732/ajax/post', data, function(data) {
				var datas = {};
				datas.data = renderSourceByDomain(data);
				var template = $('#source-template').val();
				var html = Mustache.render(template, datas);
				$('#source-body2').html(html);
			}, 'json')
		}

		function renderSourceByDomain(data) {
			var keys = data['data']['items'][0];
			var vals = data['data']['items'][1];
			var fields = data['data']['fields'];
			var datas = [];

			keys.forEach(function(item) {
				datas.push(item[0]);
			})

			vals.forEach(function(item, index1) {
				item.forEach(function(one, index2) {
					datas[index1][fields[index2 + 1]] = one;
					if (fields[index2 + 1] === 'avg_visit_time') {
						datas[index1]['avg_visit_time'] = renderOffset(one);
					}
				})
			})
			return datas;
		}

	


	$('.main-nav a').click(function(e) {
		e.preventDefault();
		var $this = $(this),
			index = $('.main-nav a').index($this),
			text = $this.text();
		document.title = text + '-播种网';
		$('.main-nav a').removeClass('on');
		$this.addClass('on');
	});

	var $$ = function(id) {
		return document.getElementById(id);
	};
	//new Editor($$("text-input"), $$("preview"));
});



var handler = {
	oldAd: function() {
		var opt = arguments[0];
		console.log(opt);
		renderMulti2(['主导航/广告位', 'WWW首页/焦点图', 'WWW首页/通栏广告位'], opt.target.replace('#', ''), '旧广告点击量');
		// 获取全部

		function renderMulti2(keys, id, title) {
			var eventOption = {
				'ids': 'ga:63911100',
				'dimensions': 'ga:date',
				'metrics': 'ga:totalEvents',
				'start-date': daysAgo(60),
				'end-date': '2013-06-26',
				'max-results': 100
			};

			var urls = [];
			keys.forEach(function(one) {
				eventOption.filters = buildFilter(one);
				urls.push({
					url: 'http://106.3.38.38:8888/api/ga.json?' + $.param(eventOption)
				});
			});

			var url1 = (function() {
				eventOption.filters = buildFilter(keys[0]);
				return 'http://106.3.38.38:8888/api/ga.json?' + $.param(eventOption);
			})();

			var url2 = (function() {
				eventOption.filters = buildFilter(keys[1]);
				return 'http://106.3.38.38:8888/api/ga.json?' + $.param(eventOption);
			})();

			var url3 = (function() {
				eventOption.filters = buildFilter(keys[2]);
				return 'http://106.3.38.38:8888/api/ga.json?' + $.param(eventOption);
			})();

			console.log(url1);
			// 队列请求，同时请求，但有共同callback
			$.when($.ajax({
					url: url1
				}),
				$.ajax({
					url: url2
				}),
				$.ajax({
					url: url3
				})).then(function() {
				console.log(arguments);
				//this callback will be fired once all ajax calls have finished.
				console.log('done!!');
				//console.log(resp1[0]);
				//console.log(resp2[0]);
				// 合并row数据,用第一个数据来加
				var data = arguments[0][0];

				var datas = [];
				l = arguments.length;
				for (var i = 1; i < l; i++) {
					datas.push(arguments[i][0]['rows']);
				}
				console.log('总共有', l);
				data.rows.forEach(function(one, index) {

					datas.forEach(function(s) {
						console.log('currunt value is', one[1]);
						console.log('current one value', s[index][1]);

						one[1] = one[1] * 1 + s[index][1] * 1;
						console.log('value is', one[1]);
					})

					//console.log(one);
					//console.log(data2.rows[index][1]);
					//one.push(data2.rows[index][1]);
				});
				console.log(data);
				renderArea(data, id, title, true, false, false);
			});
		}

	},
	rank: function() {

	},
	app: function() {
		var opt = arguments[0];
		$.get(API + '/api/' + opt['api'] + '.json?type=' + opt['type'], function(data) {
			// 是否为反向数据
			if (opt.dataAdapter) {
				opt.dataAdapter.split(',').forEach(function(one) {
					data = dataAdapter[one].call(this, data);
				});
			}

			// 如果为app，则累加
			if (opt['api'] === 'app' && opt['type'] === 'status') {
				data.all = (function(data) {
					var rs = {};
					var rows = data.stats
					for (var i in rows[0]) {
						// 数字相加
						if (typeof rows[0][i] === 'number') {
							rs[i] = rows[0][i] + rows[1][i];
						} else {
							rs[i] = rows[0][i];
							if (i === 'platform') {
								rs[i] = '汇总';
							}
						}
					}
					return rs;
				})(data);
				data.stats.push(data.all);
			}

			// 百度统计在线用户不靠谱
			if (data.data && data.data.onlineNumber) {
				data.data.onlineNumber = parseInt(data.data.onlineNumber * 2.8, 10);
			}

			// 模版html
			var template;
			if (opt['template'] || opt['templateId']) {
				if (opt['templateId']) {
					template = $(opt['templateId']).val();
				} else {
					template = opt['template'];
				}
				var html = Mustache.render(template, data);
				console.log(html);
				$(opt['target']).html(html);
			}

			// 面积图
			if (opt['chartType'] === 'area') {
				var rows = data;

				//转换为统一格式 rows[[20120321,1258],[...],...]
				// 友盟数据转换
				if (opt['api'] === 'app' && opt['type'] !== 'rank') {
					rows = (function() {
						var rs = [];
						data.dates.forEach(function(one, index) {
							rs.push([one, data['stats'][0]['data'][index]]);
						});
						return rs;
					})();
				}

				if (opt['api'] === 'app' && opt['type'] === 'rank') {
					console.log(rows);
				}

				// 百度数据转换
				if (opt['api'] === 'baidu') {
					console.log(data);
					rows = (function() {
						var rs = [],
							dates = data.data.items[0],
							datas = data.data.items[1];
						//所有--换成0
						datas.forEach(function(one) {
							one.forEach(function(oneone, index) {
								if (oneone === '--') {
									one[index] = 0;
								}
							})
						});
						//console.log(dates)
						//console.log(datas)
						dates.forEach(function(one, index) {
							rs.push(dates[index].concat(datas[index]));
						});
						return rs;
					})();
				}

				renderArea({
					rows: rows
				}, opt['target'], opt['title'], opt['avg'], opt['all']);
			}

		});
	}
}

$(function() {
	// 取消关注
	/*$(document).on('click', '.remove-fav', function() {
		var data = $(this).data('key');
		delFav(data);
		$(this).closest('li').remove();
	})*/

	$('.sub-nav>li>ul>li').click(function() {
		var $this = $(this);
		var index = $(this).index();
		localStorage.setItem('currentSubTab', index);
		var boxIndex = $('.curr-box').index();
		$(this).addClass('curr-nav').siblings().removeClass('curr-nav');
		var $box = $('.curr-box > .box').eq(index);
		$box.show().siblings().hide();

		// 已经渲染过一次，不再重复
		if ($this.data('render') !== true) {

			var charts = $box.find('textarea').eq(0).val();
			if (charts) {
				charts = JSON.parse(charts);
				charts.forEach(function(one, index2) {
					//console.log(index);
					// 根据位置生成DOM唯一id
					var divId = 'pie_' + boxIndex + '_' + index + '_' + index2;
					$box.append('<div class="chart-box"><div id="' + divId + '"></div><span class="chart-detail">明细</span></div>');

					// 定义了处理数据的handler
					if (one.handler) {
						var option = one.option;
						option.target = '#' + divId;
						handler[one.handler].call(this, option);
						// 设置了轮循
						if (one.option.interval) {
							setInterval(function() {
								handler[one.handler].call(this, option);
							}, one.option.interval * 1000);
							return;
						}

					}
					var options = {
						'ids': 'ga:63911100',
						'dimensions': one.dimensions,
						'metrics': one.metrics,
						'filters': one.filters,
						'max-results': 100,
						'start-date': oneMonthAgo,
						'end-date': now
					}
					//指定了开始时间
					if (one.option && one.option['start-date']) {
						options['start-date'] = one.option['start-date'];
					}

					//指定了结束时间
					if (one.option && one.option['end-date']) {
						options['end-date'] = one.option['end-date'];
					}

					// 指定了结束时间的位移
					if (one.option && one.option.offset) {
						options['end-date'] = daysAgo(one.option.offset * 1);
					}
					if (options.metrics === 'ga:totalEvents') {
						options.metrics = 'ga:totalEvents,ga:uniqueEvents';
					}

					setTimeout(function() {
						$('#' + divId).data('option', $.param(options));
					}, 0);

					if (one.chartType !== 'status') {
						$.get(API + '/api/ga.json?' + $.param(options), function(datas) {
							var data;
							if (one.chartType === 'pie') {
								data = datas.rows.map(function(one) {
									return {
										name: one[0],
										value: one[1],
										color: get_random_color()
									}
								});
							} else if (one.chartType === 'line') {
								data = datas;
							} else {
								//console.log(datas)
							}

							if (one.chartType === 'pie') {
								render_pie(data, divId, one.title);
								$this.data('render', true);
							}

							if (one.chartType === 'line') {
								$('#' + divId).next('.chart-detail').show();
								render_line(data, divId, one.title, one.avg, one.all);
							}

							if (one.chartType === 'area') {
								renderArea(datas, divId, one.title, one.avg, one.all);
							}

							if (one.chartType === 'multiArea') {
								renderMulti(one.filters, divId, one.title, one.option);
							}

						})
					} else {
						$.get(API + '/api/status.json?type=' + one.filters, function(data) {
							//console.log(data);
							renderArea({
								rows: data
							}, divId, one.title, one.avg, one.all);
						});
					}

				});
			}
		}

	});

});

/*// 明细数据展示
$(document).on('click', '.chart-detail', function() {

	var $table = $(this).next('.chart-detail-table');
	if ($table.length) {
		if ($table.is(':hidden')) {
			$table.show();
		} else {
			$table.hide();
		}
		return;
	}
	var options = $(this).prev('div').eq(0).data('option');
	//console.log(option);
	var tpl = $('#chart-detail-tpl').val();
	var $this = $(this);

	$.get(API + '/api/ga.json?' + options, function(datas) {
		var x = datas.rows.map(function(one) {
			return {
				xx: one[0]
			};
		});

		var y = datas.rows.map(function(one) {
			return {
				yy: one[1]
			};
		});

		if (datas.rows[0][2]) {
			var z = datas.rows.map(function(one) {
				return {
					zz: one[2]
				};
			});

		}
		var html = Mustache.render(tpl, {
			x: x,
			y: y,
			z: z
		});
		$this.after(html);
	});
});*/

$(document).on('click', '.node-item', function(e) {
	e.preventDefault();
	var fid = $(this).data('fid');
	$('.node-item-on').removeClass('node-item-on')
	$(this).addClass('node-item-on');
	$.get(API + '/api/node.json?fid=' + fid, function(data) {
		var titleMap = {
			'view': '浏览数',
			'topic': '发贴数',
			'reply': '回复数'
		};
		['view', 'topic', 'reply'].forEach(function(item) {
			var rows = data.rows.map(function(one) {
				return [one.date, one[item]];
			});
			renderArea({
				rows: rows
			}, 'node-' + item + '-info', '30天内' + titleMap[item], true, false);
		});

	})
});