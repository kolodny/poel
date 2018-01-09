'use strict';

const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

describe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it(`rejects dangling tasks`, () => {
    assert.equal(info.stdout.trim(), 'Error is: Worker died');
  });
});
