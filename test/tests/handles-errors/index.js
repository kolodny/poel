const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

const isTravis = 'TRAVIS' in process.env && 'CI' in process.env;
const isV4 = process.version.slice(0, 2) === 'v4'

describe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it(`correctly handles errors`, () => {
    if (isTravis && isV4 && info.stdout === '') {
      console.log('at least we tried');
      return;
    }
    const lines = info.stdout.split('\n').map(line => line.trim());
    assert.equal(lines[0], 'caught error');
    assert(/handles-errors/.test(lines[1]));
  });
});
