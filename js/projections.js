/**
* Shadow Projection v1.0.0 (2016-09-19)
*
* (c) 2012-2016 Black Label
*
* License: Creative Commons Attribution (CC)
*/

/* global Highcharts module:true */
/* eslint no-loop-func: 0 */

/**
 * @namespace planeProjection
 **/

(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {

	var PlaneProjection,
		LineProjection,
		each = H.each,
		wrap = H.wrap,
		merge = H.merge,
		getPointSpline = H.seriesTypes.spline && H.seriesTypes.spline.prototype.getPointSpline,
		M = 'M',
		L = 'L',
		AXIS = 'Axis',
		X = 'x',
		Y = 'y',
		Z = 'z',
		MIN = 'min',
		MAX = 'max';

/**
* WRAPPED FUNCTIONS
*/
	if (H.seriesTypes.scatter) {
		wrap(H.seriesTypes.scatter.prototype, 'drawPoints', function (p) {
			p.apply(this, [].slice.call(arguments, 1));
			PlaneProjection.generatePlaneProjection(this);
			LineProjection.generateLineProjection(this);
		});
	}
	/**
	* @description An object containing functions responsible for generating plane projections
	* @memberof planeProjection
	**/

	PlaneProjection = H.seriesTypes.scatter.prototype.PlaneProjection = {

		/**
		 * @description the function responsible for getting the default options from configuration
		 * @param {Boolean} enabled: information if projections should be enabled
		 * @param {String} fill: fill color of projections
		 * @param {Boolean} byPoint: information if radius should be taken from point, or global options
		 * @param {Number} radius: projections radius
		 * @param {String} stroke-width: the width of stroke in projections
		 * @returns {Object} parameters for point projections
		 * @memberof planeProjection
		 **/
		getDefaultOptions: function () {
			return {
				enabled: true,
				fill: 'rgba(50,50,50,0.8)',
				byPoint: false, // boolean - check if color and radius is by point or by global options
				radius: 8,
				'stroke-width': 0
			};
		},
		/**
		 * @description the main function responsible for generating plane projection
		 * @param {Object} series Highcharts series for which shadows are generated
		 * @returns {Object} this - series
		 * @memberof planeProjection
		 **/
		generatePlaneProjection: function (series) {
			var options = merge({}, PlaneProjection.getDefaultOptions(), series.options.planeProjection),	// add default options
				enabled = options.enabled, // boolean if shadows should be generated or not
				renderer = series.chart.renderer,
				attrsShadowArr = [], // array containing attributes shadows in all three planes (XY, XZ and YZ respectively)
				seriesGroup = series.group;
			if (!enabled) {
				return series;
			}
			each(series.points, function (point) {	// iterate over all series points, adding custom attributes related to every point etc.
				attrsShadowArr = PlaneProjection.getOptionsForPoint(point, options);
				if (!point.shadowPoints) {	// if shadowPoints array not exists yet, add this array. Inside are paths for shadows (with their attributes)
					point.shadowPoints = [
						renderer.path([]).attr(attrsShadowArr[0]).add(seriesGroup),
						renderer.path([]).attr(attrsShadowArr[1]).add(seriesGroup),
						renderer.path([]).attr(attrsShadowArr[2]).add(seriesGroup)
					];
				}
				each(point.shadowPoints, function (sp, i) {
					sp.attr({
						zIndex: attrsShadowArr[i].zIndex	// updating zIndex for every path
					});
					sp.animate({
						d: PlaneProjection.generateShadowPoint(point, options.radius, i)	// generate new path shape (animate is used because of a need for animation in 'live' charts)
					});
				});
			});
			return series;
		},

		/**
		 * @description function responsible for generating specific shadow projections for one point
		 * @param {Object} point series point for which shadow is generated
		 * @param {Number} r Radius for drawn shadows
		 * @param {Number} plane Plane in which shadows are generated: 0 - XY, 1 - XZ, 2 - YZ (related to standard coordinate systems 'XYZ' axis order: 0 - X = 0, 1 - Y = 0, 2 - Z = 0)
		 * @returns {Array} Array containing path for single shadow point, related to SVG path ['M', xVal, yVal, ...]
		 * @memberof planeProjection
		 **/
		generateShadowPoint: function (point, r, plane) {
			var series = point.series,
				path,
				cos = Math.cos,
				sin = Math.sin,
				numberOfPointsForOneShadow = 2 * r, // number of points for used to draw single shadow path so shadow looks like circle not a polygon - looks to be related to r
				alpha = 2 * Math.PI / numberOfPointsForOneShadow, // path looks like circle where point is drawn every alpha degrees (until whole 2*PI degrees is made)
				xAxis = series.xAxis,
				yAxis = series.yAxis,
				zAxis = series.zAxis,
				radius = {
					x: xAxis.toValue(r) - xAxis.toValue(0), // radius calculated in xAxis values - made because axes may have different ranges in pixels for the same radius
					y: yAxis.toValue(r) - yAxis.toValue(0), // radius calculated in yAxis values
					z: zAxis.toValue(r) - zAxis.toValue(0) // radius calculated in zAxis values
				},
				shadowPoints = [], // array of shadow points containing point objects with x,y and z values used for drawing circle path
				perspectivePoints,
				currentAxis,
				currentAxisPlanner,
				shadow,
				planer = [
					[X, Y, Z, MIN],
					[Y, X, Z, MIN],
					[Z, Y, X, MAX]
				][plane],
				i;
			for (i = 0; i <= numberOfPointsForOneShadow; i++) {
				shadow = {};
				currentAxis = planer[0] + AXIS;
				currentAxisPlanner = series[currentAxis][planer[3]];
				shadow[planer[0]] = series[currentAxis].toPixels(currentAxisPlanner, true);
				currentAxis = planer[1] + AXIS;
				currentAxisPlanner = point[planer[1]] + radius[planer[1]] * cos(i * alpha);
				shadow[planer[1]] = series[currentAxis].toPixels(currentAxisPlanner, true);

				currentAxis = planer[2] + AXIS;
				currentAxisPlanner = point[planer[2]] + radius[planer[2]] * sin(i * alpha);
				shadow[planer[2]] = series[currentAxis].toPixels(currentAxisPlanner, true);
				shadowPoints.push(shadow);
			}
			perspectivePoints = H.perspective(shadowPoints, series.chart, true); // using perspective on points in one plane (XY, XZ or YZ)
			path = PlaneProjection.getShadowPath(perspectivePoints, series.chart); // calculate the path for final points
			return path;
		},
		/**
		 * @description function responsible for calculating shadow path for a single point in one plane
		 * @param {Array} perspectivePoints array of points after perspective recalculated their x,y and z position
		 * @returns {Array} Array containing path for single shadow point
		 * @memberof planeProjection
		 **/
		getShadowPath: function (perspectivePoints) {
			var path;
			each(perspectivePoints, function (p) {
				p.plotX = p.x; // adding plotX, plotY and plotZ values so standard getPointSpline() may be used
				p.plotY = p.y;
				p.plotZ = p.z;
			});
			path = [	// starting point for shadow
				M,
				perspectivePoints[0].plotX,
				perspectivePoints[0].plotY
			];
			for (var i = 0; i < perspectivePoints.length - 1; i++) {
				path = path.concat(getPointSpline.call(null, perspectivePoints, perspectivePoints[i + 1], i + 1));	// getPointSpline is used to get curved edges for circle
			}
			return path;
		},
		getOptionsForPoint: function (point, options) {
			var accuracy = 1000000,
				optionsArr; // the smallest resolution between points giving a change to recognize them
			if (options.byPoint) {
				options.fill = point.color;
				options.radius = point.graphic.r || point.graphic.radius;
			}
			optionsArr = [
				merge({
					zIndex: point.x * accuracy
				}, options),
				merge({
					zIndex: point.y * accuracy
				}, options),
				merge({
					zIndex: 1 / point.z * accuracy
				}, options)
			];
			return optionsArr;
		}
	};




	/**
	* @description An object containing functions responsible for generating line projections
	* @memberof planeProjection
	**/

	LineProjection = H.seriesTypes.scatter.prototype.LineProjection = {


		/**
		 * @description the function responsible for getting the default options from configuration
		 * @param {Boolean} enabled: information if line projection should be enabled
		 * @param {String} dashStyle: style of line projection
		 * @param {Number} zIndex: zIndex of line projection
		 * @param {String} stroke: color of line stroke
		 * @param {String} stroke-width: the width of stroke in line projections
		 * @returns {Object} parameters for point projections
		 * @memberof planeProjection
		 **/
		getDefaultOptions: function () {
			return {
				enabled: false,
				'stroke-width': 1,
				dashstyle: 'dash',
				zIndex: 2,
				stroke: 'white',
				colorByPoint: false
			};
		},

		/**
		 * @description the main function responsible for generating line projection
		 * @param {Object} series Highcharts series for which line projections are generated
		 * @returns {Object} this - series
		 * @memberof planeProjection
		 **/
		generateLineProjection: function (series) {
			var chart = series.chart,
				options = merge({}, LineProjection.getDefaultOptions(), series.options.lineProjection),
				lineProjection = options.enabled, // boolean if line projections should be drawn or not
				renderer = chart.renderer,
				seriesGroup = series.group;
			if (!lineProjection) {
				return series;
			}
			each(series.points, function (point) {
				options.stroke = options.colorByPoint ? point.color : options.stroke;	// stroke for each lineProjections group
				if (!point.shadowLines) {
					point.shadowLines = renderer.path([]).attr(options).add(seriesGroup);	// added group - fixing not hiding lineProjection bug
				}
				point.shadowLines.animate({
					d: LineProjection.getLinePath(point)
				});
			});
			return series;
		},
		/**
		 * @description function responsible for generating line projections for a single point
		 * @param {Object} point Point for which shadows are generated
		 * @returns {Array} Array containing line paths for single point, related to SVG path ['M', xVal, yVal, ...]
		 * @memberof planeProjection
		 **/
		getLinePath: function (point) {
			var series = point.series,
				chart = series.chart,
				xAxis = series.xAxis,
				yAxis = series.yAxis,
				zAxis = series.zAxis,
				starter = [M, point.plotX, point.plotY],
				path = [],
				i,	// index of drawn line
				perspectivePoints,
				plotZ = series.zAxis.translate(point.z);
			perspectivePoints = H.perspective([{
				x: point.plotXold,
				y: point.plotYold,
				z: zAxis.translate(zAxis.max)
			}, {
				x: point.plotXold,
				y: yAxis.toPixels(yAxis.min, true),
				z: plotZ
			}, {
				x: xAxis.toPixels(xAxis.min, true),
				y: point.plotYold,
				z: plotZ
			}], chart, true);
			for (i = 0; i < 3; i++) {
				path = path.concat(starter);
				path.push(
					L,
					perspectivePoints[i].x,
					perspectivePoints[i].y
				);
			}
			return path;
		}
	};
}));
