var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var clean = require('gulp-clean');
var argv = require('yargs').argv;
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var helper = require('./../helper/helper.js');
/**
 * Minify css
 */
gulp.task('minify-css', function () {

    return gulp.src([
        helper.getBasePath() + '/css/openSans.css',
        helper.getBasePath() + '/css/bellezaFont.css',
        helper.getBasePath() + '/css/bellezaLatoFont.css',
        helper.getBasePath() + '/css/datepicker/default.css',
        helper.getBasePath() + '/css/datepicker/default.date.css',
        helper.getBasePath() + '/css/style.css',
        helper.getBasePath() + '/css/images.css'
    ])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat({path: 'app.min.css', stat: {mode: 0666}}))
        .pipe(gulp.dest(helper.getDeployPath() + '/css'));

});

gulp.task('sass', gulpSequence('minify-css'));

