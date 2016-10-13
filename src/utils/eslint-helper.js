#!/usr/bin/env node
var config = require('./get-config')();
var path = require('path');
var PathsExist = require('./paths-exist');
var exec = require('./exec');
var Watch = require('./watch');

var eslintHelper = function(program) {
  var files = [];
  program.src.forEach(function(src) {
    // make it recursive
    if (PathsExist(src) && path.extname(src) === '') {
      src = path.join(src, '**', '*.*');
    }
    files.push(src);
  });

  var command =  [
    'eslint',
    '--color',
    '--no-eslintrc',
    '--ignore', 'node_modules',
    '--plugin', 'json',
    '--plugin', 'markdown',
    '--parser-options', '{ecmaVersion:6,sourceType:module,parser:espree}',
    '--config', path.join(__dirname, '..', '..', 'node_modules', 'eslint-config-videojs', 'eslintrc.json')
  ].concat(files);

  if (program.errors) {
    command.push('--quiet');
  }

  if (program.fix) {
    command.push('--fix');
  }

  var run = function() {
    exec(command);
  };

  if (program.watch) {
    Watch(program.src, run);
  } else {
    run();
  }
};

module.exports = eslintHelper;
