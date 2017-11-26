'use strict';

const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

describe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it('takes less time then if one process ran them all', () => {
    const crunchingTime = JSON.parse(info.stdout);
    assert(
      crunchingTime < 1000 * numCPUs,
      `${crunchingTime} should be less than ${1000 * numCPUs}`
    );
  });
});
