const poel = require('../../../');
const cluster = require('cluster');

const isTravis = 'TRAVIS' in process.env && 'CI' in process.env;
const isV4 = process.version.slice(0, 2) === 'v4';

(async () => {
  const pool = await poel({
    kill,
  });
  console.log(pool.$.totalWorkers);
  const killedPromise = new Promise((resolve) => {
    if (isTravis && isV4) {
      console.log(pool.$.totalWorkers - 1);
      setTimeout(resolve, 1000);
      return
    }
    cluster.once('exit', () => {
      console.log(pool.$.totalWorkers);
    });
    cluster.once('online', resolve)
  });
  await pool.kill();
  await killedPromise;
  console.log(pool.$.totalWorkers);
  pool.$.shutdown()
})();

function kill() {
  cluster.worker.kill();
}
