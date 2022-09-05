const app = require('../api/app')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection');

beforeEach(() => {
    return seed(testData);
})

afterAll(() => {
    return db.end();
})