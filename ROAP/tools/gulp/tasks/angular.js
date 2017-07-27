var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var ngTemplate = require('gulp-ng-template');
var argv = require('yargs').argv;
var clean = require('gulp-clean');
var insert = require('gulp-insert');
var helper = require('./../helper/helper.js');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var merge = require('merge-stream');
/**
 * Compile all javascript file to one big minified file.
 * This task will also inherit the angular templates
 */
gulp.task('js', function () {

    return gulp.src([
        helper.getBasePath() + '/js/lib/jQuery.min.js',
        helper.getBasePath() + '/js/lib/jquery.ajax.min.js',
        helper.getBaseRoot() + '/roa-constants/constants/roap_exports.js',
        helper.getBasePath() + '/js/lib/angular.min.js',
        helper.getBasePath() + '/js/lib/angular-touch.min.js',
        helper.getBasePath() + '/js/lib/angular-sanitize.min.js',
        helper.getBasePath() + '/js/lib/retina.js',
        helper.getBasePath() + '/js/lib/swiper.min.js',
        helper.getBasePath() + '/js/lib/picker.js',
        helper.getBasePath() + '/js/lib/picker.date.js',
        helper.getBasePath() + '/js/lib/picker.date.js',
        helper.getBasePath() + '/js/lib/angular-ui-route.js',
        helper.getBasePath() + '/js/lib/formValidator/jquery.form-validator.min.js',
        helper.getBasePath() + '/js/config/httpProvider.js',
        helper.getBasePath() + '/js/config/stateProvider.js',
        helper.getBasePath() + '/js/config/versionProvider.js',
        helper.getBasePath() + '/js/controller/mainController.js',
        helper.getBasePath() + '/js/controller/faqController.js',
        helper.getBasePath() + '/js/controller/faqDetailController.js',
        helper.getBasePath() + '/js/controller/newsController.js',
        helper.getBasePath() + '/js/controller/newsDetailController.js',
        helper.getBasePath() + '/js/controller/featureController.js',
        helper.getBasePath() + '/js/controller/featureDetailController.js',
        helper.getBasePath() + '/js/controller/languageController.js',
        helper.getBasePath() + '/js/controller/navigationController.js',
        helper.getBasePath() + '/js/controller/sidebarController.js',
        helper.getBasePath() + '/js/controller/socialShareController.js',
        helper.getBasePath() + '/js/controller/sliderController.js',
        helper.getBasePath() + '/js/controller/supportController.js',
        helper.getBasePath() + '/js/controller/registerController.js',
        helper.getBasePath() + '/js/controller/passwordRecoveryController.js',
        helper.getBasePath() + '/js/controller/accountActivationController.js',
        helper.getBasePath() + '/js/controller/profileController.js',
        helper.getBasePath() + '/js/controller/gettingStartedController.js',
        helper.getBasePath() + '/js/services/uiCommunicate.js',
        helper.getBasePath() + '/js/services/metatagFormatter.js',
        helper.getBasePath() + '/js/services/notificationManager.js',
        helper.getBasePath() + '/js/models/uiCommunicateModel.js',
        helper.getBasePath() + '/js/data/uiCommunicateData.js',
        helper.getBasePath() + '/js/data/faqProps.js',
        helper.getBasePath() + '/js/data/featureDetail.js',
        helper.getBasePath() + '/js/templates.js',
        helper.getBasePath() + '/js/partials.js',
        helper.getBasePath() + '/js-build/partials.js',
        helper.getBasePath() + '/js-build/templates.js',
        helper.getBasePath() + '/js-build/app_for_minification.js',
        helper.getBasePath() + '/js/factory.js',
        helper.getBasePath() + '/js/controllers.js',
        helper.getBasePath() + '/js/services.js',
        helper.getBasePath() + '/js/models.js',
        helper.getBasePath() + '/js/directives.js'])
        .pipe(concat({path: 'app.min.js', stat: {mode: 0666}}))
        .pipe(uglify({compress: {hoist_funs: false}}))
        .pipe(insert.prepend(helper.copyright(argv.VERSION)))
        .pipe(gulp.dest(helper.getDeployPath() + '/js'));
});
/**
 * Compile the angular templates
 */
gulp.task('templates', function () {
    return gulp.src(helper.getBasePath() + '/templates/**/*.html')
        .pipe(minifyHtml({empty: true, quotes: true}))
        .pipe(ngTemplate({
            moduleName: 'templates',
            standalone: true,
            filePath: 'templates.js',
            prefix: argv.URL + '/templates/',
        })).pipe(gulp.dest(helper.getBasePath() + '/js-build')); // output file: 'dist/js/templates.js'


});
gulp.task('templates_partial', function () {
    return gulp.src([helper.getBasePath() + '/partials/**/*.html'])
        .pipe(minifyHtml({empty: true, quotes: true}))
        .pipe(ngTemplate({
            moduleName: 'templates_partials',
            standalone: true,
            filePath: 'partials.js',
            prefix: argv.URL + '/partials/',
       })).pipe(gulp.dest(helper.getBasePath() + '/js-build')); // output file: 'dist/js/templates.js'

})

/**
 * Prepare angular config
 */
gulp.task('prepare-angular-config', function () {
     var normalApp;

    if (argv.BRANCH !== "master") {
        //Empty it because development
        normalApp =  gulp.src([
            helper.getBasePath() + '/js/app.js'
        ]).pipe(replace(/'{{ADD_MODULES}}'/g, ""))
            .pipe(rename('app.js'))
            .pipe(gulp.dest(helper.getBasePath() + '/js-build')); // output file: 'dist/js/templates.js'
    }
    else {
        //Add the templates module
       normalApp = gulp.src([
            helper.getBasePath() + '/js/app.js'
        ]).pipe(replace(/'{{ADD_MODULES}}'/g, "'templates', 'templates_partials'"))
            .pipe(rename('app.js'))
            .pipe(gulp.dest(helper.getBasePath() + '/js-build')); // output file: 'dist/js/templates.js'
    }

    //We need to compile always one with "compiled_app.js" for minification that stage system also can work with the templates
    var compiledApp = gulp.src([
            helper.getBasePath() + '/js/app.js'
        ]).pipe(replace(/'{{ADD_MODULES}}'/g, "'templates', 'templates_partials'"))
            .pipe(rename('app_for_minification.js'))
            .pipe(gulp.dest(helper.getBasePath() + '/js-build')); // output file: 'dist/js/templates.js'

    return merge(normalApp,compiledApp);

});

gulp.task('angular', gulpSequence('prepare-angular-config', 'templates','templates_partial','js'));



