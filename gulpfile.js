'use strict';
var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	jsdoc = require('gulp-jsdoc3'),
	markdown = require('gulp-markdown'),
	wrapper = require('gulp-wrapper'),
	rename = require("gulp-rename");

gulp.task('lint', function () {
	return gulp.src(['js/*.js'])
		.pipe(eslint())
		.pipe(eslint.failOnError())
		.pipe(eslint.formatEach());
});

gulp.task('jsdoc', function (cb) {
	// Consider using https://github.com/englercj/tsd-jsdoc to generate typescript definitions from JSDoc comments
	var config = require('./jsdoc.json');
	gulp.src(['README.md','./js/projections.js'], { read: false })
		.pipe(jsdoc(config, cb));
});
 
var gulp = require('gulp');

gulp.task('markdownHTML', function () {
	gulp.src('README.md')
		.pipe(markdown())
		.pipe(wrapper({
			header: '<html>\n<head>\n<link rel="stylesheet" type="text/css" href="css/styles.css">\n</head>\n',
			footer: '</html>'
		}))
		.pipe(rename({
			basename: "index",
		}))
		.pipe(gulp.dest('./'));
});

