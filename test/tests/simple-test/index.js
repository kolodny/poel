'use strict';

const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

describe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it(`has ${numCPUs} pids with one dupe`, () => {
    const pids = JSON.parse(info.stdout);
    assert.equal(pids.length, numCPUs + 1);
    assert.equal(new Set(pids).size, numCPUs);
  });
});
