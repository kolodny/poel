'use strict';

const poel = require('../../../');
const cluster = require('cluster');

require('../util').asyncToGenerator(function *() {
  const pool = yield poel({
    kill,
  });
  console.log(pool.$.totalWorkers);
  const killedPromise = new Promise((resolve) => {
    cluster.once('exit', () => {
      console.log(pool.$.totalWorkers);
    });
    cluster.once('online', resolve)
  });
  yield pool.kill();
  yield killedPromise;
  console.log(pool.$.totalWorkers);
  pool.$.shutdown()
})();

function kill() {
  cluster.worker.kill();
}
