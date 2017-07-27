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

    var copyJSSubmodule = gulp.src([helper.getBaseRoot() + '/roa-constants/constants/roag_exports.js'])
        .pipe(rename('roag_exports.js'))
        .pipe(gulp.dest(helper.getDeployPath() + '/js/static/'));

    var copyHTML = gulp.src([helper.getBasePath() + "/templates/**"])
        .pipe(gulp.dest(helper.getDeployPath() + '/templates'));


    return merge(copyJS, copyBuildJS, copyJSSubmodule, copyHTML);
});
/**
 * Copy all needed production javascript
 */
gulp.task('copy-production', function () {

    var copyJS = gulp.src([

        helper.getBasePath() + "/js/lib/sql.js"
    ])
        .pipe(gulp.dest(helper.getDeployPath() + '/js'));


    return merge(copyJS);
});


/**
 * Copy all needed files for production AND development
 */
gulp.task('copy-relevant', function () {

    var copySQLite = gulp.src([helper.getBasePath() + "/sqlite/**"])
        .pipe(gulp.dest(helper.getDeployPath() + '/sqlite'));

    var copyImg = gulp.src([helper.getBasePath() + "/img/**"])
        .pipe(gulp.dest(helper.getDeployPath() + '/img'));

    var copyImg = gulp.src([helper.getBasePath() + "/image/**"])
        .pipe(gulp.dest(helper.getDeployPath() + '/image'));

    var copyFont = gulp.src([helper.getBasePath() + "/fonts/**"])
        .pipe(gulp.dest(helper.getDeployPath() + '/fonts'));

    return merge(copySQLite, copyImg, copyFont);
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
    gulp.task('copy', gulpSequence('copy-production', 'copy-relevant', 'clean-build-js'));
}
