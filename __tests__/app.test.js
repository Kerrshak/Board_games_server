const request = require("supertest");
const app = require("../app");
const db = require(`../db/connection`);
const data = require("../db/data/development-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

describe('.all to any non-existing endpoint', () => {
    test('upon receiving any request to a non-existing endpoint the server should return status 404 and an error message', () => {
        return request(app)
        .get('/api/cat')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({ msg: "We couldn't find what you were looking for, please try again" })
        })
    })
})

describe('.GET /api/categories', () => {
    test('should return an array of objects and status 200', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.categories)).toBe(true)
        })
    })
    test('each object should have the properties of "slug" and "description"', () => {
        return request(app)
        .get('/api/categories')
        .then(({body}) => {
            body.categories.forEach(category => {
                expect(category).toEqual(expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                }))
            })
        })
    })
})

describe('.GET /api/reviews', () => {
    test('should return an array of objects and status 200', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.reviews)).toBe(true)
        })
    })
    test('each object should have the properties of review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at, and comment_count the last of which cross-references the comments table', () => {
        return request(app)
        .get('/api/reviews')
        .then(({body}) => {
            body.reviews.forEach(category => {
                expect(category).toEqual(expect.objectContaining({
                    review_id : expect.any(Number),
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                }))
            })
        })
    })
    test('array should be sorted by date in descending order', () => {
        return request(app)
        .get('/api/reviews')
        .then(({body}) => {
            const regex = /[^0-9]/g

            for(let i = 1; i < body.reviews.length; i++) {
                const date1 = parseInt(body.reviews[i - 1].created_at.replace(/[^0-9]/g, ''))
                const date2 = parseInt(body.reviews[i].created_at.replace(/[^0-9]/g, ''))
                
                expect(date1).toBeGreaterThanOrEqual(date2)
            }
        })
    })
})

describe('.GET /api/reviews/:review_id', () => {
    test('should respond with status 200 and a review object with properties review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at, and comment_count the last of which cross-references the comments table', () => {
        return request(app)
        .get('/api/reviews/3')
        .expect(200)
        .then(({body}) => {
            expect(body.review).toEqual({
                review_id : 3,
                title: 'Karma Karma Chameleon',
                designer: 'Rikki Tahta',
                owner: 'happyamy2016',
                review_img_url:
                  'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                review_body:
                  'Try to trick your friends. If you find yourself being dealt the Chamelean card then the aim of the game is simple; blend in... Meanwhile the other players aim to be as vague as they can to not give the game away ',
                category: 'hidden-roles',
                created_at: "2021-01-18T10:01:42.151Z",
                votes: 5,
                comment_count: "5"
            })
        })
    })
    test('should respond with status 404 and an error message if the review does not exist', () => {
        return request(app)
        .get('/api/reviews/9001')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'This review does not exist'})
        })
    })
    test('should respond with status 400 and an error message if the the review_id has been entered in an unexpected format', () => {
        return request(app)
        .get('/api/reviews/halo3')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad request'})
        })
    })
})

describe('.GET /api/reviews/:review_id/comments', () => {
    test('should respond with status 200 and an array of comments objects with properties comment_id, body, votes, author, review_id, created_at', () => {
        return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({comments: [
                {
                    comment_id: 59,
                    body: 'Quis duis mollit ad enim deserunt.',
                    votes: 3,
                    author: 'jessjelly',
                    review_id: 1,
                    created_at: "2021-03-27T19:48:58.110Z"
                },
                {
                    comment_id: 60,
                    body: 'Laboris nostrud ea ex occaecat aute quis consectetur anim.',
                    votes: 17,
                    author: 'cooljmessy',
                    review_id: 1,
                    created_at: "2021-03-27T14:15:38.110Z"
                },
                {
                    comment_id: 61,
                    body: 'Consequat nisi dolor nulla esse sunt eu ipsum laborum deserunt duis. Ffugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat?',
                    votes: 1,
                    author: 'weegembump',
                    review_id: 1,
                    created_at: "2021-03-27T14:15:36.110Z"
                }
            ]})
        })
    })
    test('should respond with status 204 and a message if there are no comments on the review', () => {
        return request(app)
        .get('/api/reviews/11/comments')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({msg: 'No comments exist on this review'})
        })
    })
    test('should respond with status 404 and an error message if the review does not exist', () => {
        return request(app)
        .get('/api/reviews/9001/comments')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Not found'})
        })
    })
    test('should respond with status 400 and an error message if the the review_id has been entered in an unexpected format', () => {
        return request(app)
        .get('/api/reviews/halo3/comments')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad request'})
        })
    })
})

describe('.POST /api/reviews/:review_id/comments', () => {
    test('when passed an object in the format of {username: a username from users table, body: string} returns status 201 and the comment', () => {
        return request(app)
        .post('/api/reviews/1/comments')
        .send({username: 'weegembump', body: '11/10 game, did not expect the Spanish Inquisition'})
        .expect(201)
        .then(({body}) => {
            expect(body.comment).toEqual({
                comment_id: 62,
                body: '11/10 game, did not expect the Spanish Inquisition',
                votes: 0,
                author: 'weegembump',
                review_id: 1,
                created_at: expect.any(String) //necessary as there is a 7 millisecond delay between the controller and the test but this will vary depending on PC and background processes
            })
        })
    })
    test('should respond with status 404 and an error message if the review does not exist', () => {
        return request(app)
        .post('/api/reviews/9001/comments')
        .send({username: 'weegembump', body: '11/10 game, did not expect the Spanish Inquisition'})
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Not found'})
        })
    })
    test('should respond with status 400 and an error message if the the review_id has been entered in an unexpected format', () => {
        return request(app)
        .post('/api/reviews/halo3/comments')
        .send({username: 'weegembump', body: '11/10 game, did not expect the Spanish Inquisition'})
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad request'})
        })
    })
    test('should respond with with status 401 and an error message if the user does not exist on the users table', () => {
        return request(app)
        .post('/api/reviews/1/comments')
        .send({username: 'THE SPANISH INQUISITION', body: '11/10 game, did not expect the Spanish Inquisition'})
        .expect(401)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Unauthorized'})
        })
    })
    test('should respond with with status 400 and an error message if the comment property is empty', () => {
        return request(app)
        .post('/api/reviews/1/comments')
        .send({username: 'weegembump', body: ''})
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad request'})
        })
    })
})

describe('PATCH /api/reviews/:review_id', () => {
    test('should take an object in the form {inc_votes: 0} and respond with the review and status 200', () => {
        return request(app)
        .patch('/api/reviews/3')
        .send({inc_votes: 0})
        .expect(200)
        .then(({body}) => {
            expect(body.review).toEqual({
                review_id : 3,
                title: 'Karma Karma Chameleon',
                designer: 'Rikki Tahta',
                owner: 'happyamy2016',
                review_img_url:
                  'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                review_body:
                  'Try to trick your friends. If you find yourself being dealt the Chamelean card then the aim of the game is simple; blend in... Meanwhile the other players aim to be as vague as they can to not give the game away ',
                category: 'hidden-roles',
                created_at: "2021-01-18T10:01:42.151Z",
                votes: 5
            })
        })
    })
    test('should take an object in the form {inc_votes: 20} and respond with a review that has had it\'s votes updated and status 200', () => {
        return request(app)
        .patch('/api/reviews/3')
        .send({inc_votes: 5})
        .expect(200)
        .then(({body}) => {
            expect(body.review).toEqual({
                review_id : 3,
                title: 'Karma Karma Chameleon',
                designer: 'Rikki Tahta',
                owner: 'happyamy2016',
                review_img_url:
                  'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                review_body:
                  'Try to trick your friends. If you find yourself being dealt the Chamelean card then the aim of the game is simple; blend in... Meanwhile the other players aim to be as vague as they can to not give the game away ',
                category: 'hidden-roles',
                created_at: "2021-01-18T10:01:42.151Z",
                votes: 10
            })
        })
    })
    test('should return status 400 and an error message if object is in wrong format', () => {
        return request(app)
        .patch('/api/reviews/3')
        .send({inc_votes: 'Four'})
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Value to increase votes by was in an incorrect format, no changes have been made'})
        })
    })
    test('should respond with status 404 and an error message if the review does not exist', () => {
        return request(app)
        .patch('/api/reviews/9001')
        .send({inc_votes: 5})
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'This review does not exist'})
        })
    })
    test('should respond with status 400 and an error message if the the review_id has been entered in an unexpected format', () => {
        return request(app)
        .patch('/api/reviews/halo3')
        .send({inc_votes: 5})
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad request'})
        })
    })
})

describe('GET /api/users', () => {
    test('should return an array of objects and status 200', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.users)).toBe(true)
        })
    })
    test('each object should have the properties of "username", "name" and "avatar_url"', () => {
        return request(app)
        .get('/api/users')
        .then(({body}) => {
            expect(body.users.length).toBe(6)
            body.users.forEach(category => {
                expect(category).toEqual(expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                }))
            })
        })
    })
})