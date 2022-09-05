const testData = require('../data/test-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = (data) => {
  return seed(data).then(() => db.end());
};

runSeed(testData);
