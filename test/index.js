const path = require('path');
const fs = require('fs');

const numCPUs = require('os').cpus().length;

process.on('unhandledRejection', (error) => {
  console.log('Caught error', error);
});

const fixturesDir = path.join(__dirname, 'tests');
const fixtures = fs.readdirSync(fixturesDir)
  .map(fixture => path.join(fixturesDir, fixture))
  .filter(fixture => fs.statSync(fixture).isDirectory());

describe('poel', function() {
  console.log(`${numCPUs} CPUs`);
  this.retries(4);
  fixtures.forEach(fixture => require(fixture));
});
