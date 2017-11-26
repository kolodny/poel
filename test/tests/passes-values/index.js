'use strict';

const assert = require('assert');
const numCPUs = require('os').cpus().length;

const util = require('../util');

describe(__dirname.split('/').pop(), () => {
  const info = {}
  before((done) => util.run(__dirname, info, done));
  it('can pass value to and from functions', () => {
    assert.equal(info.stdout.trim(), 'foo#bar#baz');
  });
});
