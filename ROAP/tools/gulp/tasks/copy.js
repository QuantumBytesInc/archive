var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var argv = require('yargs').argv;
var clean = require('gulp-clean');
var insert = require('gulp-insert');
var helper = require('./../helper/helper.js');
var merge = require('merge-stream');
var rename = require('gulp-rename');
/**
 * Copy all needed development javascript
 */
gulp.task('copy-development', function () {

    var copyJS = gulp.src([
        '!' + helper.getBasePath() + '/js/app.js',
        helper.getBasePath() + "/js/**"
    ])
        .pipe(gulp.dest(helper.getDeployPath() + '/js'));

    //Don't take app_for_minification.js because this one is just for minification
    var copyBuildJS = gulp.src([
        helper.getBasePath() + '/js-build/app.js'
    ]).pipe(gulp.dest(helper.getDeployPath() + '/js'));

    var copyJSSubmodule = gulp.src([helper.getBaseRoot() + '/roa-constants/constants/roap_exports.js'])
        .pipe(rename('roap_exports.js'))
        .pipe(gulp.dest(helper.getDeployPath() + '/js/static/'));

        var copyCSS = gulp.src([helper.getBasePath() + "/css/**"])
        .pipe(gulp.dest(helper.getDeployPath() + '/css'));

    var copyHTML = gulp.src([helper.getBasePath() + "/templates/**"])
        .pipe(gulp.dest(helper.getDeployPath() + '/templates'));


    var copyHTMLPartials = gulp.src([helper.getBasePath() + "/partials/**"])
        .pipe(gulp.dest(helper.getDeployPath() + '/partials'));

    return merge(copyJS, copyBuildJS, copyJSSubmodule,copyCSS, copyHTML, copyHTMLPartials);
});


/**
 * Copy all needed files for production AND development
 */
gulp.task('copy-relevant', function () {

    var copyImg = gulp.src([helper.getBasePath() + "/img/**"])
        .pipe(gulp.dest(helper.getDeployPath() + '/img'));


    return merge(copyImg);
});

/**
 * Clean the build fodler
 */
gulp.task('clean-build-js', function () {
    return gulp.src([helper.getBasePath() + '/js-build'], {read: false})
        .pipe(clean({force: true}));
});

//We don't need to copy app.min.js and app.min.css, because its already done in the other tasks.
if (argv.BRANCH !== "master") {
    gulp.task('copy', gulpSequence('copy-development', 'copy-relevant', 'clean-build-js'));
}
else {
    gulp.task('copy', gulpSequence('copy-relevant', 'clean-build-js'));
}
