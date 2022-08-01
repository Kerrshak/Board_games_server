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
            console.log(body)
            expect(Array.isArray(body.categories.rows)).toBe(true)
        })
    })
    test('each object should have the properties of "slug" and "description"', () => {
        return request(app)
        .get('/api/categories')
        .then(({body}) => {
            body.categories.rows.forEach(category => {
                expect(category).toEqual(expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                }))
            })
        })
    })
})

describe('.GET /api/reviews/:review_id', () => {
    test('should respond with status 200 and a review object with properties review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at', () => {
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
                votes: 5
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
            expect(body).toEqual({msg: 'The review ID should take the form of an integer, please try again'})
        })
    })
})