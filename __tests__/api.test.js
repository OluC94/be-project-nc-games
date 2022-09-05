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
            expect(Array.isArray(body.categories)).toBe(true);
            expect(body.categories.length).toBe(4);
            body.categories.forEach((category) => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
    test('404: responds with "Not found" if invalid endpoint is input', () => {
        return request(app)
        .get('/api/InvalidPath')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: "Not found"})
        })
    })
})

describe('GET /api/reviews/:review_id', () => {
    test('200: responds with an object containing the appropriate properties', () => {
        const testReviewID = 12;
        const testTitle = `"Scythe; you're gonna need a bigger table!"`
        



        return request(app)
        .get(`/api/reviews/${testReviewID}`)
        .expect(200)
        .then(({body}) => {
            const { review } = body;
            console.log(review);
            expect(review).toMatchObject({
                review_id: expect.any(Number),
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String),
            })
            expect(review.review_id).toBe(12);
            expect(review.title).toBe();
            expect(review.review_body).toBe();
            expect(review.designer).toBe();
            expect(review.revireview_img_urlew_id).toBe();
            expect(review.votes).toBe();
            expect(review.category).toBe();
            expect(review.owner).toBe();
            expect(review.created_at).toBe();

            
        })
    })
    test.todo('400: Bad Request when invalid review ID is used in the path')
    test.todo('404: Not Found when valid review ID that does not exist is used in the path')
})