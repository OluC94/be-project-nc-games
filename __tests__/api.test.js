const app = require('../api/app')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection');
const request = require('supertest');

beforeEach(() => {
    return seed(testData);
})

afterAll(() => {
    return db.end();
})

describe('GET /api/categories', () => {
    test('200: responds with an array of category objects with the correct properties', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true);
            expect(body.length > 0).toBe(true);
            body.forEach((category) => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
    test('404: responds with "Not found" if invalid endpoint is input', () => {
        return request(app)
        .get('/api/category')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: "Not found"})
        })
    })
})