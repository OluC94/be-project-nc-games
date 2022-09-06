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
        const testTitle = `Scythe; you're gonna need a bigger table!`
        const testTimestamp = `2021-01-22T10:37:04.839Z`
        const testURL = `https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg`
        const testBody = 'Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.'
        
        return request(app)
        .get(`/api/reviews/${testReviewID}`)
        .expect(200)
        .then(({body}) => {
            const { review } = body;
            expect(review).toEqual(expect.objectContaining({
                review_id: 12,
                title: testTitle,
                review_body: testBody,
                designer: 'Jamey Stegmaier',
                review_img_url: testURL,
                votes: 100,
                category: 'social deduction',
                owner: 'mallionaire',
                created_at: testTimestamp
            }))
        })
    })
    test('404: responds with Review Not Found when requesting a valid review ID that does not exist', () => {
        const testReviewID = 100;
        return request(app)
        .get(`/api/reviews/${testReviewID}`)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Review not found");
        })
    })
    test('400: responds with Bad Request when invalid review ID is used in the path', () => {
        const testReviewID = "invalid_ID";
        return request(app)
        .get(`/api/reviews/${testReviewID}`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad Request");
        })
    })
    
})

describe('GET /api/users', () => {
    test('200: responds with an object containing array of user information objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.hasOwnProperty('users')).toBe(true);
            expect(Array.isArray(body.users)).toBe(true);
            expect(body.users.length).toBe(4);
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})

describe('PATCH /api/reviews/:review_id', () => {
    test('200: responds with the correctly updated review object when incrementing the review votes', () => {
        const testInc = {inc_votes: 5};
        const testReviewID = 10;
        return request(app)
        .patch(`/api/reviews/${testReviewID}`)
        .send(testInc)
        .expect(200)
        .then(({body}) => {
            expect(body.review).toEqual(expect.objectContaining({
                review_id: 10,
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: 15,
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String)
            }))
        })
    })
    test('200: responds with the correctly updated review object when decrementing the review votes', () => {
        const testDec = {inc_votes: -10};
        const testReviewID = 9;
        return request(app)
        .patch(`/api/reviews/${testReviewID}`)
        .send(testDec)
        .expect(200)
        .then(({body}) => {
            expect(body.review).toEqual(expect.objectContaining({
                review_id: 9,
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: 0,
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String)
            }))
        })
    })
    test.todo('400: responds with bad request when invalid increment is provided')
    test.todo('400: responds with bad request when attempting to patch an invalid review ID')
    test.todo('404 responds with Review Not Found when attempting to patch a valid review ID that does not exist')
})
