'use strict';
var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	jsdoc = require('gulp-jsdoc3'),
	markdown = require('gulp-markdown'),
	rename = require('gulp-rename'),
	inject = require('gulp-inject');

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
 
gulp.task('markdownHTML', function () {
	gulp.src('template.html')
		.pipe(inject(
			gulp.src('README.md')
				.pipe(markdown()), 
				{
					starttag: '<!-- inject:body:html -->', 
					transform: function (filePath, file) {
    					return file.contents.toString('utf8')
    				}
    			})
		).pipe(rename({
			basename: "index",
		}))
		.pipe(gulp.dest('./'));
});
