var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var requireDir = require('require-dir');
var tasks = requireDir('./tasks/');


gulp.task('default', gulpSequence('angular', 'sass','copy'));
