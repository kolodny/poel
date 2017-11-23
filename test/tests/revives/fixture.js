const poel = require('../../../');
const cluster = require('cluster');

(async () => {
  const pool = await poel({
    kill,
  });
  console.log(pool.$.totalWorkers);
  const killedPromise = new Promise((resolve) => {
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
