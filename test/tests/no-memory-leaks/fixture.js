'use strict';

const poel = require('../../../');
const numCPUs = require('os').cpus().length;

const heapUsedMiB = () => process.memoryUsage().heapUsed / 1024 / 1024;
const timeToTest = 15000;

require('../util').asyncToGenerator(function *() {
  const pool = yield poel({
    workThatResolves,
    workThatHangs,
  });
  const startingHeap = heapUsedMiB();

  let start = new Date();
  while (new Date - start < timeToTest) {
    const promises = []
    for (let i = 0; i < numCPUs; i++) {
      promises.push(pool.workThatResolves());
    }
    try {
      yield Promise.all(promises);
    } catch (error) {}
  }
  const middleHeap = heapUsedMiB();

  start = new Date();
  while (new Date - start < timeToTest) {
    const promises = []
    for (let i = 0; i < numCPUs; i++) {
      promises.push(pool.workThatHangs());
    }
    Promise.all(promises).catch(() => {});
  }

  yield pool.$.shutdown();
  global.gc();
  const endingHeap = heapUsedMiB();
  console.log(JSON.stringify({
    startingHeap,
    middleHeap,
    endingHeap,
  }));
})();

function workThatResolves() {
  const random = Math.random();
  if (random < 0.05) {
    throw new Error(`${random} is less than 0.05`);
  } else if (random > 0.9) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (random < 0.95) {
          resolve(random);
        } else {
          reject(new Error(`${random} is greater than 0.95`));
        }
      })
    })
  } else {
    return random
  }
}

function workThatHangs() {
  return new Promise(() => {});
}
