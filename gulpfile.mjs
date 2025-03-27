'use strict';

import build from '@microsoft/sp-build-web';
import gulp from 'gulp';
import * as fastServe from 'spfx-fast-serve-helpers';

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
