'use strict';

const npmDownloads = require('./');
const test = require('tape');

test('test shall fail', t => {
  npmDownloads();
  t.fail();
});
