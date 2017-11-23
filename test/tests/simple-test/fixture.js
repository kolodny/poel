const poel = require('../../../');
const numCPUs = require('os').cpus().length;

(async () => {
  const pool = await poel({
    getPid,
  });
  const promises = [];
  for (let i = 0; i < numCPUs + 1; i++) {
    promises.push(pool.getPid())
  }
  const pids = await Promise.all(promises);
  console.log(pids);

  setTimeout(() => pool.$.shutdown(), 1000);
})();

function getPid() {
  return process.pid;
}
