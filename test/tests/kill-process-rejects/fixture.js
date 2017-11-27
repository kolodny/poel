'use strict';

const cluster = require('cluster');
const poel = require('../../../');
const numCPUs = require('os').cpus().length;

require('../util').asyncToGenerator(function *() {
  const pool = yield poel({
    soon,
  });
  const promises = [];
  for (let i = 0; i < numCPUs + 1; i++) {
    promises.push(pool.soon())
  }
  for (const id in cluster.workers) {
    setTimeout(() => {
      cluster.workers[id].kill()
    }, 100);
    break;
  }
  try {
    yield Promise.all(promises);
  } catch (error) {
    console.log(`Error is: ${error.message}`);
  }

  pool.$.shutdown();
})();

function soon() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(process.pid), 200)
  });
}
