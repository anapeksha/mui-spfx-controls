'use strict';

const build = require('@microsoft/sp-build-web');
const gulp = require('gulp');
const fastServe = require('spfx-fast-serve-helpers');

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

const getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  const result = getTasks.call(build.rig);
  result.set('serve', result.get('serve-deprecated'));
  return result;
};

fastServe.addFastServe(build);

build.initialize(gulp);
