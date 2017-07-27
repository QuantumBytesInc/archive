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
 * Minify css from scss compile
 */

gulp.task('minify-css', function () {


    if (argv.BRANCH !== "master") {
        //Development, don't minify our css.
        return gulp.src([
            helper.getBasePath() + '/css-build/**/*.css',
        ])
             .pipe(replace(/{{URL}}/g, argv.URL))
            .pipe(concat({path: 'app.min.css', stat: {mode: 0666}}))
            .pipe(insert.prepend(helper.copyright(argv.VERSION)))
            .pipe(gulp.dest(helper.getDeployPath() + '/css'));
    }
    else {
        //Master, minify the css
        return gulp.src([
            helper.getBasePath() + '/css-build/**/*.css',
        ])
                 .pipe(replace(/{{URL}}/g, argv.URL))
            .pipe(concat({path: 'app.min.css', stat: {mode: 0666}}))
            .pipe(cleanCSS({compatibility: '*'}))
            .pipe(insert.prepend(helper.copyright(argv.VERSION)))
            .pipe(gulp.dest(helper.getDeployPath() + '/css'));
    }


});
/**
 * Clear whole css folder
 */
gulp.task('clean-css-folder', function () {
    return gulp.src([helper.getDeployPath() + '/css/**/**'], {read: false})
        .pipe(clean({force: true}));
});
/**
 * Remove all css files out of buildfolder
 */
gulp.task('clean-build-css', function () {
    return gulp.src([helper.getBasePath() + '/css-build'], {read: false})
        .pipe(clean({force: true}));
});

/**
 * Compile all scss files into css
 */
gulp.task('compile-sass', function () {

    var sassCompile = gulp.src([
            helper.getBasePath() + '/scss/normalize.scss',
            helper.getBasePath() + '/scss/app.scss',
            helper.getBasePath() + '/scss/**/*.scss'])

        .pipe(sass({
            compass: true,
            bundleExec: true,
        }).on('error', sass.logError))
        .pipe(gulp.dest(helper.getBasePath() + '/css-build'));
    return sassCompile;
});
gulp.task('sass', gulpSequence('clean-css-folder','compile-sass', 'minify-css', 'clean-build-css'));

