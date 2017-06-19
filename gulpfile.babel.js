// @flow
/* eslint-env node */
/* eslint no-console: 0 */

import gulp from 'gulp';

import del from 'del';
import { exec } from 'child_process';
import path from 'path';

import dotenv from 'dotenv';

dotenv.config();

gulp.task('babel:clear-cache', () =>
  del(path.join('node_modules', '.cache', 'babel-loader')),
);

const GRAPHQL_QUERIES = path.join('app', 'queries', '*.graphql');
const GRAPHQL_TYPES = path.join('app', 'queries', 'graphql-types.js');
const GRAPHQL_SCHEMA = path.join('graphql', 'schema.json');
const GRAPHQL_URL = process.env.GRAPHQL_URL || '';
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY || '';

gulp.task('graphql:download', cb => {
  exec(
    `${path.join(
      'node_modules',
      '.bin',
      'apollo-codegen',
    )} introspect-schema ${GRAPHQL_URL} --header "X-API-KEY: ${GRAPHQL_API_KEY}" --output ${GRAPHQL_SCHEMA}`,
    (err, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
      cb(err);
    },
  );
});

gulp.task('graphql:types', ['graphql:download'], cb => {
  exec(
    `${path.join(
      'node_modules',
      '.bin',
      'apollo-codegen',
    )} generate ${GRAPHQL_QUERIES} --schema ${GRAPHQL_SCHEMA} --target flow --output ${GRAPHQL_TYPES} --no-add-typename`,
    (err, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
      cb(err);
    },
  );
});

gulp.task('watch:graphql', () => [
  gulp.watch([GRAPHQL_QUERIES.replace(/\\/g, '/')], ['babel:clear-cache']),
  gulp.watch(
    [GRAPHQL_QUERIES.replace(/\\/g, '/'), GRAPHQL_SCHEMA.replace(/\\/g, '/')],
    ['graphql:types'],
  ),
]);

gulp.task('watch', ['watch:graphql']);

gulp.task('default', ['graphql:types']);
