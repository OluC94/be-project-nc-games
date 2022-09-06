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
            console.log(review);
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
    test.todo('400: Bad Request when invalid review ID is used in the path')
    test.todo('404: Not Found when valid review ID that does not exist is used in the path')
})