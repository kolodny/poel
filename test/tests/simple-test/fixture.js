'use strict';

const poel = require('../../../');
const numCPUs = require('os').cpus().length;

require('../util').asyncToGenerator(function *() {
  const pool = yield poel({
    getPid,
  });
  const promises = [];
  for (let i = 0; i < numCPUs + 1; i++) {
    promises.push(pool.getPid())
  }
  const pids = yield Promise.all(promises);
  console.log(pids);

  pool.$.shutdown();
})();

function getPid() {
  return process.pid;
}
