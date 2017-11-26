'use strict';

const poel = require('../../../');
const numCPUs = require('os').cpus().length;

require('../util').asyncToGenerator(function *() {
  const pool = yield poel({
    hashify,
    toLowerCase
  });
  console.log(yield pool.hashify('foo', 'bar', 'baz'));

  pool.$.shutdown();
})();

function hashify() {
  return [].slice.call(arguments).join('#')
}

function toLowerCase(str) {
  return str.toLowerCase();
}
