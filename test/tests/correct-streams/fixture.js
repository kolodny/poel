'use strict';

const poel = require('../../../');
const numCPUs = require('os').cpus().length;

require('../util').asyncToGenerator(function *() {
  const pool = yield poel({
    log,
    error,
  });
  console.log(1);
  console.error(2);
  yield log(3);
  yield error(4);

  pool.$.shutdown();
})();

function log(number) {
  console.log(number)
}

function error(number) {
  console.error(number)
}
