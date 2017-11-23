const poel = require('../../../');
const numCPUs = require('os').cpus().length;

(async () => {
  const pool = await poel({
    log,
    error,
  });
  console.log(1);
  console.error(2);
  await log(3);
  await error(4);

  pool.$.shutdown();
})();

function log(number) {
  console.log(number)
}

function error(number) {
  console.error(number)
}
