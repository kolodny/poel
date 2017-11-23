const path = require('path');
const spawn = require('child_process').spawn;

exports.run = (dir, info, done) => {
  const file = path.join(dir, 'fixture')
  const args = [
    '--require',
    'babel-register',
    '--require',
    'babel-polyfill',
    file,
  ];
  var child = spawn('node', args);
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
