
var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

var to5 = require('gulp-babel');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var dts = require('dts-generator');
var typescript = require('gulp-typescript');
var tsc = require('typescript');

var tsProject = typescript.createProject('./tsconfig.json', { typescript: tsc });
var currentOutPath;

gulp.task('build-html-es6', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'es6'));
});

gulp.task('build-es6', ['build-html-es6'], function () {
  gulp.src(paths.definitions)
    .pipe(gulp.dest(paths.output + 'es6'));
  return gulp.src(paths.dtsSrc.concat(paths.source))
    .pipe(typescript(tsProject))  
    .pipe(gulp.dest(paths.tsOutput));
});

gulp.task('build-html-commonjs', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-commonjs', ['build-html-commonjs'], function () {
  gulp.src(paths.definitions)
    .pipe(gulp.dest(paths.output + 'commonjs'));
  return gulp.src(paths.sourcees6)
    .pipe(to5(assign({}, compilerOptions, { modules: 'common' })))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-html-amd', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-amd', ['build-html-amd'], function () {
  gulp.src(paths.definitions)
    .pipe(gulp.dest(paths.output + 'amd'));
  return gulp.src(paths.sourcees6)
    .pipe(to5(assign({}, compilerOptions, { modules: 'amd' })))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-html-system', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-system', ['build-html-system'], function () {
  gulp.src(paths.definitions)
    .pipe(gulp.dest(paths.output + 'system'));
  return gulp.src(paths.sourcees6)
    .pipe(to5(assign({}, compilerOptions, { modules: 'system' })))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('generateDTS', function (done) {
  dts.default({
    name: 'aurelia-auth',
    project: './src',
    main: 'aurelia-auth/index',
    out: './aurelia-auth.d.ts'
  }).then(done);
});

gulp.task('build', function (callback) {
  return runSequence(
    'clean',
    'generateDTS',
    'build-es6',
    [ 'build-commonjs', 'build-amd', 'build-system'],
    callback
    );
});
