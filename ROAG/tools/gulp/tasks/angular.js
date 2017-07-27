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
        helper.getBaseRoot() + '/roa-constants/constants/roag_exports.js',
        helper.getBasePath() + '/js/lib/coherent.js',
        helper.getBasePath() + '/js/lib/base64.js',
        helper.getBasePath() + '/js/static/translations.js',
        helper.getBasePath() + '/js/lib/jquery.min.js',
        helper.getBasePath() + '/js/lib/jquery-ui.js',
       // helper.getBasePath() + '/js/lib/sql.js' //DONT include this file, because SQL.js is already minified, and in minified state it crashes and can't open DB again, thats why we add it normal,
        helper.getBasePath() + '/js/lib/resizeSensor.js',
        helper.getBasePath() + '/js/lib/elementQueries.js',
        helper.getBasePath() + '/js/lib/angular.min.js',
        helper.getBasePath() + '/js/lib/angular-sanitize.min.js',
        helper.getBasePath() + '/js/lib/ng-slider.min.js',
        helper.getBasePath() + '/js/lib/angular-ui-router.js',
        helper.getBasePath() + '/js/lib/angular-translate.js',
        helper.getBasePath() + '/js/lib/angular-dragdrop.min.js',
        helper.getBasePath() + '/js/lib/angularUI-bootstrap.js',
        helper.getBasePath() + '/js/config/routeProvider.js',
        helper.getBasePath() + '/js/config/translationProvider.js',
        helper.getBasePath() + '/js/config/httpProvider.js',
        helper.getBasePath() + '/js/factories/factories.js',
        helper.getBasePath() + '/js/directives/controls/buttonIcon.js',
        helper.getBasePath() + '/js/directives/controls/buttonText.js',
        helper.getBasePath() + '/js/directives/controls/checkbox.js',
        helper.getBasePath() + '/js/directives/controls/dropDown.js',
        helper.getBasePath() + '/js/directives/controls/roaSrc.js',
        helper.getBasePath() + '/js/directives/controls/roaBackgroundImage.js',
        helper.getBasePath() + '/js/directives/controls/qbSlider.js',
        helper.getBasePath() + '/js/directives/controls/radio.js',
        helper.getBasePath() + '/js/directives/controls/registerKey.js',
        helper.getBasePath() + '/js/directives/controls/textbox.js',
        helper.getBasePath() + '/js/directives/controls/chatTab.js',
        helper.getBasePath() + '/js/directives/controls/chatTabCtrl.js',
        helper.getBasePath() + '/js/directives/controls/storage.js',
        helper.getBasePath() + '/js/directives/controls/item.js',
        helper.getBasePath() + '/js/directives/directives.js',
        helper.getBasePath() + '/js/controller/bodyController.js',
        helper.getBasePath() + '/js/controller/settingsController.js',
        helper.getBasePath() + '/js/controller/escController.js',
        helper.getBasePath() + '/js/controller/helpController.js',
        helper.getBasePath() + '/js/controller/temporaryController.js',
        helper.getBasePath() + '/js/controller/logController.js',
        helper.getBasePath() + '/js/controller/informationController.js',
        helper.getBasePath() + '/js/controller/state/login/loginController.js',
        helper.getBasePath() + '/js/controller/state/game/topbar/topbar.js',
        helper.getBasePath() + '/js/controller/state/game/chat/chatController.js',
        helper.getBasePath() + '/js/controller/state/game/charCreation/charCreationController.js',
        helper.getBasePath() + '/js/controller/state/game/charSelection/charSelectionController.js',
        helper.getBasePath() + '/js/controller/state/game/taskbar/taskbarController.js',
        helper.getBasePath() + '/js/controller/state/game/storage/storageController.js',
        helper.getBasePath() + '/js/controller/state/game/overlay/overlayController.js',
        helper.getBasePath() + '/js/controller/state/game/minigames/gathering/mining/gatheringMiningController.js',
        helper.getBasePath() + '/js/services/logService.js',
        helper.getBasePath() + '/js/services/uiDB.js',
        helper.getBasePath() + '/js/services/helperService.js',
        helper.getBasePath() + '/js/services/uiService.js',
        helper.getBasePath() + '/js/services/uiCommunicate.js',
        helper.getBasePath() + '/js/services/uiSocket.js',
        helper.getBasePath() + '/js/services/uiAudio.js',
        helper.getBasePath() + '/js/services/uiUser.js',
        helper.getBasePath() + '/js/models/uiCommunicateModel.js',
        helper.getBasePath() + '/js/models/uiCommunicateSocketModel.js',
        helper.getBasePath() + '/js/data/uiCommunicateData.js',
        helper.getBasePath() + '/js/data/uiCommunicateSocketData.js',
        helper.getBasePath() + '/js/data/uiControllerData.js',
        helper.getBasePath() + '/js/data/uiChannelData.js',
        helper.getBasePath() + '/js/data/uiBroadcastData.js',
        helper.getBasePath() + '/js-build/templates.js',
        helper.getBasePath() + '/js-build/app_for_minification.js',
        helper.getBasePath() + '/js/factory.js',
        helper.getBasePath() + '/js/controllers.js',
        helper.getBasePath() + '/js/services.js',
        helper.getBasePath() + '/js/models.js',
    ])
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
        ]).pipe(replace(/'{{ADD_MODULES}}'/g, "'templates'"))
            .pipe(rename('app.js'))
            .pipe(gulp.dest(helper.getBasePath() + '/js-build')); // output file: 'dist/js/templates.js'
    }

    //We need to compile always one with "compiled_app.js" for minification that stage system also can work with the templates
    var compiledApp = gulp.src([
            helper.getBasePath() + '/js/app.js'
        ]).pipe(replace(/'{{ADD_MODULES}}'/g, "'templates'"))
            .pipe(rename('app_for_minification.js'))
            .pipe(gulp.dest(helper.getBasePath() + '/js-build')); // output file: 'dist/js/templates.js'

    return merge(normalApp,compiledApp);

});

gulp.task('angular', gulpSequence('prepare-angular-config', 'templates', 'js'));



