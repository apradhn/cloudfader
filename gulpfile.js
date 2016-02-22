'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var less = require('gulp-less');
var path = require('path');

gulp.task('sass', function() {
	return gulp.src('./scss/cloudfader.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/css'))
});

gulp.task('less', function() {
	return gulp.src('./less/rzslider.less')
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')]
		}))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
	gulp.watch('./scss/cloudfader.scss', ['sass']);
	gulp.watch('./less/*.less', ['less']);
})