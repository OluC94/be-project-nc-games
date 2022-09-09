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
                created_at: testTimestamp,
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
    test('400: responds with bad request when invalid increment is provided', () => {
        const testInc = {inc_votes: 'not_a_number'};
        const testReviewID = 10;
        return request(app)
        .patch(`/api/reviews/${testReviewID}`)
        .send(testInc)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad Request")
        })
    })
    test('404: responds with Review not found when trying to patch a valid review ID that does not exist', () => {
        const testInc = {inc_votes: 5};
        const testReviewID = 50;
        return request(app)
        .patch(`/api/reviews/${testReviewID}`)
        .send(testInc)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Review not found")
        })
    })
    test('400: responds with bad request when trying to patch an invalid review ID', () => {
        const testInc = {inc_votes: 5};
        const testReviewID = 'not_an_id';
        return request(app)
        .patch(`/api/reviews/${testReviewID}`)
        .send(testInc)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('400: responds with bad request if the inc_votes key is missing from the request', () => {
        const testInc = {};
        const testReviewID = 9;
        return request(app)
        .patch(`/api/reviews/${testReviewID}`)
        .send(testInc)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })

})

describe('GET /api/reviews/:review_id (comment count)', () => {
    test('200: review response object contains comment_count key which totals the count of all comments with this review_id', () => {
        const testReviewID = 3;
        return request(app)
        .get(`/api/reviews/${testReviewID}`)
        .expect(200)
        .then(({body}) => {
            const { review } = body;
            expect(review).toMatchObject({
                review_id: 3,
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String),
                comment_count: 3
            })
        })
    })
    test('200: review response object successfully totals comment_count where review has no comments', () => {
        const testReviewID = 1;
        return request(app)
        .get(`/api/reviews/${testReviewID}`)
        .expect(200)
        .then(({body}) => {
            const { review } = body;
            expect(review.review_id).toBe(1);
            expect(review.comment_count).toBe(0);
        })
    })
})

describe('GET /api/reviews', () => {
    test('200: responds with an array of review objects containing the correct properties', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            expect(body.hasOwnProperty('reviews')).toBe(true);
            expect(Array.isArray(body.reviews)).toBe(true);
            expect(body.reviews.length).toBe(13);
            body.reviews.forEach((review) => {
                expect(review).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    designer: expect.any(String),
                    comment_count: expect.any(Number)
                });
                expect(review.hasOwnProperty('review_body')).toBe(false);
            })
        })
    })
    test('200: reviews array is sorted by date in descending order by default', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            expect(body.reviews.length).toBe(13);
            expect(body.reviews).toBeSortedBy('created_at', {descending: true});
        })
    })
    test('200: category query successfully filters the results by value specified in the query', () => {
        const pathQuery = 'category=social%20deduction'
        return request(app)
        .get(`/api/reviews?${pathQuery}`)
        .expect(200)
        .then(({body}) => {
            expect(body.hasOwnProperty('reviews')).toBe(true);
            expect(body.reviews.length).toBe(11);
            body.reviews.forEach((review) => {
                expect(review.category).toBe('social deduction')
            })
        })
    })
    test('404: responds with Page not found when requesting a bad path', () => {
        return request(app)
        .get('/api/InvalidPath')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Not found'})
        })
    })
    test('200: responds with an object containing an empty array when an existing category that has no data associated is used as the query values', () => {
        return request(app)
        .get('/api/reviews?category=children%27s%20games')
        .expect(200)
        .then(({body}) => {
            expect(body.hasOwnProperty('reviews')).toBe(true);
            expect(Array.isArray(body.reviews)).toBe(true);
            expect(body.reviews.length).toBe(0);
        })
    })
    test('404: responds with "Category not found" when a category that does not exist is used as the query value', () => {
        return request(app)
        .get('/api/reviews?category=not_a_category')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Category not found'});
        })
    })
    
})

describe('GET /api/reviews/:review_id/comments', () => {
    test('200: responds with an object containing an array of comments, where each comment contains the correct properties', () => {
        const testReviewID = 3;
        return request(app)
        .get(`/api/reviews/${testReviewID}/comments`)
        .expect(200)
        .then(({body}) => {
            expect(body.hasOwnProperty('comments')).toBe(true);
            expect(Array.isArray(body.comments)).toBe(true);
            expect(body.comments.length).toBe(3);
            body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    review_id: testReviewID
                })
            })
        })
    })
    test('200: responds with an object containing an empty array when a valid review id that has no comments is requested', () => {
        const testReviewID = 6;
        return request(app)
        .get(`/api/reviews/${testReviewID}/comments`)
        .expect(200)
        .then(({body}) => {
            expect(body.hasOwnProperty('comments')).toBe(true);
            expect(Array.isArray(body.comments)).toBe(true);
            expect(body.comments.length).toBe(0);
        })
    });
    test('404: responds with "Review not found" when a valid review id that does not exist is requested', () => {
        const testReviewID = 300;
        return request(app)
        .get(`/api/reviews/${testReviewID}/comments`)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: "Review not found"})
        })
    });
    test('400: responds with "Bad Request" when requesting the comments for an invalid review id', () => {
        const testReviewID = 'not_an_id';
        return request(app)
        .get(`/api/reviews/${testReviewID}/comments`)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: "Bad Request"})
        })
    });
})

describe('POST /api/reviews/:review_id/comments', () => {
    test('201 posts the input data and responds with the expected object', () => {
        const inputComment = {username: 'dav3rid', body: 'example text'};
        const testReviewID = 4;
        return request(app)
        .post(`/api/reviews/${testReviewID}/comments`)
        .send(inputComment)
        .expect(201)
        .then(({body}) => {
            expect(body.hasOwnProperty('comment')).toBe(true);
            expect(body.comment).toMatchObject({
                comment_id: 7,
                body: 'example text',
                review_id: 4,
                author: 'dav3rid',
                votes: 0,
                created_at: expect.any(String)
            });
        }).then(() => {
            return db.query('SELECT * FROM comments')
        }).then(({rows}) => {
            expect(rows.length).toBe(7)
        })
    })
    test('400: responds with "Bad Request" when input object is empty', () => {
        const testReviewID = 4;
        return request(app)
        .post(`/api/reviews/${testReviewID}/comments`)
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: "Bad Request"});
        }).then(() => {
            return db.query('SELECT * FROM comments')
        }).then(({rows}) => {
            expect(rows.length).toBe(6)
        })
    })
    test('400: responds with "Bad Request" when input object contains invalid key', () => {
        const inputComment = {'not_a_key': 'dav3rid', body: 'example text'};
        const testReviewID = 4;
        return request(app)
        .post(`/api/reviews/${testReviewID}/comments`)
        .send(inputComment)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: "Bad Request"});
        }).then(() => {
            return db.query('SELECT * FROM comments')
        }).then(({rows}) => {
            expect(rows.length).toBe(6)
        })
    })
    test('400: responds with "Bad Request" when input object contains username that does not exist in the database', () => {
        const inputComment = {username: 'not_a_user', body: 'example text'};
        const testReviewID = 4;
        return request(app)
        .post(`/api/reviews/${testReviewID}/comments`)
        .send(inputComment)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: "Bad Request"});
        }).then(() => {
            return db.query('SELECT * FROM comments')
        }).then(({rows}) => {
            expect(rows.length).toBe(6)
        })
    })
    test('404: responds with "Review not found" when attempting to post comments to a valid review id that does not exist in the database', () => {
        const inputComment = {username: 'dav3rid', body: 'example text'};
        const testReviewID = 400;
        return request(app)
        .post(`/api/reviews/${testReviewID}/comments`)
        .send(inputComment)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: "Review not found"});
        }).then(() => {
            return db.query('SELECT * FROM comments')
        }).then(({rows}) => {
            expect(rows.length).toBe(6)
        })
    })
})