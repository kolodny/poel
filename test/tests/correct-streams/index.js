'use strict';

const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

describe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it(`uses the correct streams`, () => {
    assert.equal(info.stdout, '1\n3\n');
    assert.equal(info.stderr, '2\n4\n');
  });
});
