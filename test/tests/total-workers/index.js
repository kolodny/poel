const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

describe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it(`can return the total number of workers`, () => {
    const workers = JSON.parse(info.stdout);
    assert.equal(workers, numCPUs);
  });
});
