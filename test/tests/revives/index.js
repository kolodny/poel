const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

describe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it(`starts a new worker when one dies`, () => {
    const expectedOutput = `${numCPUs}\n${numCPUs - 1}\n${numCPUs}`;
    assert.equal(info.stdout.trim(), expectedOutput);
  });
});
