var gulp = require('gulp');
var runSequence = require('run-sequence');
var to5 = require('gulp-babel');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var through2 = require('through2');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var tools = require('aurelia-tools');
var del = require('del');
var vinylPaths = require('vinyl-paths');

// merged output file name. a folder of paths.packageName is temporarly created in build-dts
var jsName = paths.packageName + '.js';


gulp.task('build-dts', function() {
  var importsToAdd = []; // stores extracted imports

  return gulp.src(paths.tsSource)
    .pipe(tools.sortFiles())
    .pipe(through2.obj(function(file, enc, callback) {  // extract all imports to importsToAdd
      file.contents = new Buffer(tools.extractImports(file.contents.toString('utf8'), importsToAdd));
      this.push(file);
      return callback();
    }))
    .pipe(concat(jsName)) // concat all selected files to jsName (now without their imports)
    .pipe(insert.transform(function(contents) { // re-add extracted imports on top
      return tools.createImportBlock(importsToAdd) + contents;
    }))
    .pipe(to5(assign({}, compilerOptions.dts()))); // compile to d.ts from file jsName. d.ts file is in folder paths.packageName
});

gulp.task('build-es2015',  ['build-html-es2015'], function() {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.es2015())))
    .pipe(gulp.dest(paths.output + 'es2015'));
});

gulp.task('build-commonjs', ['build-html-commonjs'], function() {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.commonjs())))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-amd', ['build-html-amd'], function() {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.amd())))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-system', ['build-html-system'], function() {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.system())))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('copy-dts', function() {
  var tdsPath = paths.packageName + '/' + paths.packageName + '.d.ts';
  return gulp.src(tdsPath)
      .pipe(rename(paths.packageName + '.d.ts'))
      .pipe(gulp.dest(paths.output + 'es2015'))
      .pipe(gulp.dest(paths.output + 'commonjs'))
      .pipe(gulp.dest(paths.output + 'amd'))
      .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('remove-dts-folder', function() {
  var tdsFolder = paths.packageName;
  return gulp.src([tdsFolder])
    .pipe(vinylPaths(del));
});

gulp.task('build-html-es2015', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'es2015'));
});

gulp.task('build-html-commonjs', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-html-amd', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-html-system', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-es2015', 'build-commonjs', 'build-amd', 'build-system'],
    'build-dts',
    'copy-dts',
    'remove-dts-folder',
    callback
  );
});
