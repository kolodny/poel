'use strict';

const poel = require('../../../');
const numCPUs = require('os').cpus().length;

const asyncToGenerator = require('../util').asyncToGenerator;

require('../util').asyncToGenerator(function *() {
  const pool = yield poel({
    fib,
  });

  const sweetSpot = findSweetSpot();
  const start = new Date();
  const promises = [];
  for (let i = 0; i < numCPUs + 1; i++) {
    promises.push(pool.fib(sweetSpot))
  }
  yield Promise.all(promises);
  console.log(new Date() - start);

  pool.$.shutdown();
})();

function fib(n) {
  if (n < 2) { return n; }
  return fib(n - 1) + fib(n - 2);
}

function findSweetSpot() {
  let i = 0;
  while (i < 100) {
    const start = new Date();
    fib(i);
    if (new Date() - start > 1000) { return i; }
    i++;
  }
}
