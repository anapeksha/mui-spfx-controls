'use strict';

import build from '@microsoft/sp-build-web';
import { exec } from 'child_process';
import { error, log } from 'console';
import gulp from 'gulp';
import * as fastServe from 'spfx-fast-serve-helpers';
import util from 'util';

const execPromise = util.promisify(exec);

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);
  result.set('serve', result.get('serve-deprecated'));
  return result;
};

fastServe.addFastServe(build);

gulp.task('build:release', async () => {
  try {
    log('Building modules...');
    await execPromise('tsc -b includes/tsconfig.build.json');
    log('Build complete.');
  } catch (err) {
    error(err);
  }
});

build.initialize(gulp);
