var path = require('path');
var fs = require('fs');

var appRoot = 'src/';
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
// your main file which exports only configure and other modules.
// usually packageName or 'index.js'
var entryFileName = pkg.name + '.js';

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  tsSource: [
    appRoot + '**/*.js',          // list files to parse for d.ts
    '!' + appRoot + entryFileName  // exclude entry file
  ],
  html: appRoot + '**/*.html',
  style: 'styles/**/*.css',
  output: 'dist/',
  doc: './doc',
  test: './test/**/*.js',
  packageName: pkg.name
};
