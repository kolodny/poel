'use strict';

const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

const myDescribe = (title, fn) => {
  if (numCPUs < 4) {
    describe.skip(`${title} (skipped on a ${numCPUs} environment`, fn)
  } else {
    describe(title, fn);
  }
}

myDescribe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it(`doesn't leak memory for resolved tasks`, () => {
    const parsed = JSON.parse(info.stdout);
    assert(parsed.middleHeap / parsed.startingHeap < 40);
  });

  it(`releases memory for pending tasks on shutdown`, () => {
    const parsed = JSON.parse(info.stdout);
    assert(parsed.endingHeap / parsed.startingHeap < 40);
  });

});
