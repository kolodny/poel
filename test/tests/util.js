const path = require('path');
const spawn = require('child_process').spawn;

exports.run = (dir, info, done) => {
  const file = path.join(dir, 'fixture')
  var child = spawn('node', ['--expose-gc', file]);
  info.stdout = '';
  info.stderr = '';
  const startTime = Date.now();
  child.stdout.on('data', (data) => {
    info.stdout += data.toString();
  });
  child.stderr.on('data', (data) => {
    info.stderr += data.toString();
  });
  child.once('close', (code) => {
    info.totalTimeMs = Date.now() - startTime;
    info.code = code;
    done();
  });
  return child;
}

// tests need to pass in v4 so async await is out :(
exports.asyncToGenerator = (fn) => {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step('next', value);
          }, function (err) {
            step('throw', err);
          });
        }
      }
      return step('next');
    });
  };
}
