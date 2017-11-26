'use strict';

const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

describe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it(`correctly handles errors`, () => {
    const lines = info.stdout.split('\n').map(line => line.trim());
    assert.equal(lines[0], 'caught error');
    assert(/handles-errors/.test(lines[1]));
  });
});
