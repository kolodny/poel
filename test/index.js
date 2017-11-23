const path = require('path');
const fs = require('fs');

const isTravis = 'TRAVIS' in process.env && 'CI' in process.env;
const isV4 = process.version.slice(0, 2) === 'v4'

const whitelist = isTravis && isV4 ?
  file => ['correct-streams', 'total-workers'].indexOf(file) !== -1 :
  file => true;

const fixturesDir = path.join(__dirname, 'tests');
const fixtures = fs.readdirSync(fixturesDir)
  .filter(whitelist)
  .map(fixture => path.join(fixturesDir, fixture))
  .filter(fixture => fs.statSync(fixture).isDirectory());

describe('poel', () => {
  fixtures.forEach(fixture => require(fixture));
});

setInterval(
  () => console.log('keeping travis alive'),
  400000
).unref();
