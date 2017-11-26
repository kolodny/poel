const path = require('path');
const fs = require('fs');

const fixturesDir = path.join(__dirname, 'tests');
const fixtures = fs.readdirSync(fixturesDir)
  .map(fixture => path.join(fixturesDir, fixture))
  .filter(fixture => fs.statSync(fixture).isDirectory());

describe('poel', () => {
  fixtures.forEach(fixture => require(fixture));
});
