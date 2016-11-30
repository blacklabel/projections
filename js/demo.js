$(function () {
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: 'container',
			type: 'scatter',
			borderWidth: 5,
			borderColor: '#e8eaeb',
			borderRadius: 0,
			backgroundColor: '#111',
			options3d: {
				enabled: true,
				alpha: 10,
				beta: 50,
				depth: 450,
				viewDistance: 5,
				fitToPlot: false,
				frame: {
					bottom: {
						size: 1,
						color: 'rgba(0,0,0,0.2)'
					},
					back: {
						size: 1,
						color: 'rgba(0,0,0,0.2)'
					},
					side: {
						size: 1,
						color: 'rgba(0,0,0,0.2)'
					}
				}
			}
		},
		title: {
			style: {
				'fontSize': '1em'
			},
			useHTML: true,
			x: -27,
			y: 8,
			text: '<span class="chart-title">Projections<span class="chart-href"> <a href="http://www.blacklabel.pl/highcharts" target="_blank"> Black Label </a> </span> <span class="chart-subtitle">plugin by </span></span>'
		},
		tooltip: {
			formatter: function () {
				return this.point.name;
			}
		},
		yAxis: {
			min: 0,
			max: 10,
			title: null
		},
		xAxis: {
			min: 0,
			max: 10,
			gridLineWidth: 1
		},
		legend: {
			enabled: false
		},
		zAxis: {
			min: 0,
			max: 10,
			showFirstLabel: false
		},
		plotOptions: {
			series: {
				states: {
					hover: {
						halo: false
					}
				}
			},
			scatter: {
				width: 10,
				height: 10,
				depth: 10
			}
		},
		series: [{
			name: 'Solar System',
			animation: {
				duration: 10
			},
			planeProjection: {
				enabled: true,
				byPoint: true
			},
			lineProjection: {
				enabled: 'hover',
				colorByPoint: true
			},
			marker: {
				radius: 13,
				symbol: 'circle',
				fillColor: {
					radialGradient: {
						cx: 0.4,
						cy: 0.3,
						r: 0.5
					},
					stops: [
						[0, 'rgba(195,195,255,1)'],
						[1, 'rgba(0,0,255,1)']
					]
				}
			},
			data: [{
				name: 'planet',
				x: 7,
				y: 5,
				z: 5,
				color: 'rgba(100,100,200,1)'
			}, {
				x: 5,
				y: 5,
				z: 5,
				name: 'sun',
				color: 'yellow',
				marker: {
					states: {
						hover: {
							radius: 18,
							fillColor: {
								radialGradient: {
									cx: 0.4,
									cy: 0.3,
									r: 0.5
								},
								stops: [
									[0, 'rgba(255,255,255,1)'],
									[1, 'rgba(255,255,0,1)']
								]
							}
						}
					},
					radius: 18,
					fillColor: {
						radialGradient: {
							cx: 0.4,
							cy: 0.3,
							r: 0.5
						},
						stops: [
							[0, 'rgba(255,255,255,1)'],
							[1, 'rgba(255,255,0,1)']
						]
					}
				}
			}, {
				x: 7.5,
				y: 5,
				z: 5,
				name: 'moon',
				color: 'rgba(200,100,100,1)',
				marker: {
					radius: 4,
					fillColor: {
						radialGradient: {
							cx: 0.4,
							cy: 0.3,
							r: 0.5
						},
						stops: [
							[0, 'rgba(159,159,255,1)'],
							[1, 'rgba(159,159,0,1)']
						]
					},
					states: {
						hover: {
							radius: 4,
							fillColor: {
								radialGradient: {
									cx: 0.4,
									cy: 0.3,
									r: 0.5
								},
								stops: [
									[0, 'rgba(159,159,255,1)'],
									[1, 'rgba(159,159,0,1)']
								]
							}
						}
					}
				}
			}]
		}]
	});


	$(chart.container).bind('mousedown.hc touchstart.hc', function (eStart) {
		eStart = chart.pointer.normalize(eStart);
		var posX = eStart.pageX,
			posY = eStart.pageY,
			alpha = chart.options.chart.options3d.alpha,
			beta = chart.options.chart.options3d.beta,
			newAlpha,
			newBeta,
			sensitivity = 5; // lower is more sensitive
		$(document).bind({
			'mousemove.hc touchdrag.hc': function (e) {
				newBeta = beta + (posX - e.pageX) / sensitivity;
				chart.options.chart.options3d.beta = newBeta;
				newAlpha = alpha + (e.pageY - posY) / sensitivity;
				chart.options.chart.options3d.alpha = newAlpha;
				chart.redraw(false);
			},
			'mouseup touchend': function () {
				$(document).unbind('.hc');
			}
		});
	});

});
