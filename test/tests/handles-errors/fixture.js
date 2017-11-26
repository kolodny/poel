'use strict';

const poel = require('../../../');
const numCPUs = require('os').cpus().length;

require('../util').asyncToGenerator(function *() {
  const pool = yield poel({
    thrower,
  });
  try {
    yield pool.thrower();
  } catch (error) {
    console.log('caught error');
    const lines = error.stack.split('\n');
    console.log(lines.filter(line => /thrower/.test(line))[0]);
    pool.$.shutdown();
  }

})();

function thrower() {
  throw new Error('My Error');
}
