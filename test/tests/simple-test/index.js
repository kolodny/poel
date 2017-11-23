const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

const isTravis = 'TRAVIS' in process.env && 'CI' in process.env;
const isV4 = process.version.slice(0, 2) === 'v4'

describe(__dirname.split('/').pop(), () => {
  if (isTravis && isV4) {
    it('does not really test well on travis with node v4', () => {});
    return
  }
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it(`has ${numCPUs} pids with one dupe`, () => {
    const pids = JSON.parse(info.stdout);
    assert.equal(pids.length, numCPUs + 1);
    assert.equal(new Set(pids).size, numCPUs);
  });
});
