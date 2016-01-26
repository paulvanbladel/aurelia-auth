var gulp         = require('gulp');
var runSequence  = require('run-sequence');
var paths        = require('../paths');
var rename       = require('gulp-rename');
var dtsGenerator = require('dts-generator');
var del          = require('del');
var vinylPaths   = require('vinyl-paths');

gulp.task('ts-prepare', function() {
  return gulp.src(paths.root + '**/*.js')
    .pipe(rename(function(path) {
      path.extname = ".ts";

      return path;
    }))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('ts-config', function() {
  return gulp.src(__dirname + '/../tsconfig.json').pipe(gulp.dest(paths.tmp));
});

gulp.task('ts-build', function() {
  return dtsGenerator.default({
    name   : paths.packageName,
    project: paths.tmp,
    out    : paths.root + paths.packageName + '.d.ts'
  });
});

gulp.task('ts-copy-dist', function() {
  return gulp.src(paths.root + 'aurelia-auth.d.ts')
    .pipe(rename(paths.packageName + '.d.ts'))
    .pipe(gulp.dest(paths.output + 'es6'))
    .pipe(gulp.dest(paths.output + 'commonjs'))
    .pipe(gulp.dest(paths.output + 'amd'))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('ts-clean', function() {
  return gulp.src([paths.tmp]).pipe(vinylPaths(del));
});


gulp.task('dts', function(callback) {
  return runSequence(
    'ts-config',
    'ts-prepare',
    'ts-build',
    'ts-copy-dist',
    'ts-clean',
    callback
  );
});