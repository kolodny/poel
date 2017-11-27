'use strict';

const cluster = require('cluster');
const EventEmitter = require('events').EventEmitter;
const numCPUs = require('os').cpus().length;

const objectifyError = error => {
  const objectified = {};
  Object.getOwnPropertyNames(error).forEach((key) => {
    objectified[key] = error[key];
  });
  return objectified;
};

const errorifyObject = (objectifiedError) => {
  const error = new Error(objectifiedError.message)
  Object.getOwnPropertyNames(objectifiedError).forEach((key) => {
      error[key] = objectifiedError[key];
  });
  return error
};

module.exports = (methods) => new Promise((resolve) => {
  if (cluster.isMaster) {
    const workersPromise = [];
    let workers = [];
    const updateWorkersArray = () => {
      workers = [];
      for (const id in cluster.workers) {
        workers.push(cluster.workers[id]);
      }
    }

    for (let i = 0; i < numCPUs; i++) {
      const worker = cluster.fork();
      worker.once('online', updateWorkersArray);
      workersPromise.push(new Promise((workerResolve) => {
        worker.once('online', workerResolve);
      }));
    }

    let nextWorkerIndex = 0
    let nextCallbackId = 0
    const callbackMap = new Map();

    const emitter = new EventEmitter();
    let running = true;

    cluster.on('message', function(worker, info) {
      if (!running) { return; }

      // node v4 doesn't pass in worker
      const data = info || worker;

      const status = data.status;
      const value = data.value;
      const callbacks = callbackMap.get(data.callbackId);
      callbackMap.delete(data.callbackId);
      const resolve = callbacks.resolve;
      const reject = callbacks.reject;
      if (status === 'resolved') {
        resolve(value);
      } else {
        const error = errorifyObject(value);
        reject(error);
      }
    })

    const shutdown = () => {
      running = false;
      callbackMap.clear();
      workers.forEach(worker => worker.process.kill());
      setTimeout(() => {
        workers.forEach(worker => worker.kill());
      }, 5000).unref();
    }

    cluster.on('exit', () => {
      updateWorkersArray();
      if (running) {
        const worker = cluster.fork();
        worker.once('online', updateWorkersArray);
      }
    });
    emitter.once('shutdown', shutdown);
    process
      .on('SIGINT', () => emitter.emit('shutdown'))
      .on('SIGTERM', () => emitter.emit('shutdown'));

    const runner = {
      $: {
        shutdown,
        get totalWorkers() { return workers.length; },
      }
    };
    Object.keys(methods).forEach(key => {
      runner[key] = function() {
        const args = Array(arguments.length);
        for (let i = 0, len = arguments.length; i < len; i++) {
          args[i] = arguments[i];
        }
        return new Promise((resolve, reject) => {
          let worker = workers[nextWorkerIndex++];
          if (nextWorkerIndex >= workers.length) { nextWorkerIndex = 0; }
          const callbackId = nextCallbackId++;
          worker.send({ key, callbackId, args });
          callbackMap.set(callbackId, { resolve, reject });
        })
      }
    });
    Promise.all(workersPromise).then(() => resolve(runner));
  } else {
    process.on('message', (data) => {
      const key = data.key;
      const args = data.args;
      const callbackId = data.callbackId;
      try {
        Promise.resolve(methods[key].apply(null, args)).then(
          value => {
            process.send({ status: 'resolved', value, callbackId });
          },
          error => {
            const value = objectifyError(error);
            process.send({ status: 'rejected', value, callbackId });
          });
      } catch (error) {
        const value = objectifyError(error);
        process.send({ status: 'rejected', value, callbackId });
      }
    });
  }
});
