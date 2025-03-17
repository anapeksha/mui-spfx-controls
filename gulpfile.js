'use strict';

import build from '@microsoft/sp-build-web';
import gulp from 'gulp';
import process from 'process';
import * as fastServe from 'spfx-fast-serve-helpers';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (config) => {
    if (!config.plugins) {
      config.plugins = [];
    }

    if (process.argv.includes('--analyze')) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }

    if (process.argv.includes('build')) {
      if (!config.resolve) {
        config.resolve = {};
      }
      config.resolve.tsConfigPath = 'tsconfig.build.json';
    }

    return config;
  },
});

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

/** Fast Serve Config */

fastServe.addFastServe(build);

build.initialize(gulp);
