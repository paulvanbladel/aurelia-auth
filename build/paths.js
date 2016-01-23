var path = require('path');

var appRoot = 'src/';

module.exports = {
  root: appRoot,
  source: appRoot+"**/*.ts",
  sourcees6: "dist/es6/**/*.js",
  tsOutput:"dist/es6",
  definitions: './aurelia-auth.d.ts',
  html: appRoot + '**/*.html',
  style: 'styles/**/*.css',
  output: 'dist/',
  doc:'./doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  dtsSrc: [
    'typings/**/*.ts',
    './jspm_packages/**/*.d.ts'
  ]
};
