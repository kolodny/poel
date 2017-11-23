const poel = require('../../../');
const numCPUs = require('os').cpus().length;

(async () => {
  const pool = await poel({});
  console.log(await pool.$.totalWorkers);
  pool.$.shutdown()
})();

function getPid() {
  return process.pid;
}
