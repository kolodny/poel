'use strict';

const poel = require('../../../');
const numCPUs = require('os').cpus().length;

require('../util').asyncToGenerator(function *() {
  const pool = yield poel({});
  console.log(yield pool.$.totalWorkers);
  pool.$.shutdown()
})();

function getPid() {
  return process.pid;
}
