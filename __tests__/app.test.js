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
            console.log('hello from test', body)
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
