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
    test('array should by default be sorted by date in descending order', () => {
        return request(app)
        .get('/api/reviews')
        .then(({body}) => {
            for(let i = 1; i < body.reviews.length; i++) {
                const date1 = parseInt(body.reviews[i - 1].created_at.replace(/[^0-9]/g, ''))
                const date2 = parseInt(body.reviews[i].created_at.replace(/[^0-9]/g, ''))
                
                expect(date1).toBeGreaterThanOrEqual(date2)
            }
        })
    })
    test('endpoint should accept queries to sort by column (descending order by default)', () => {
        return request(app)
        .get('/api/reviews?sort_by=votes')
        .then(({body}) => {
            for(let i = 1; i < body.reviews.length; i++) {
                const votes1 = body.reviews[i - 1].votes
                const votes2 = body.reviews[i].votes
                
                expect(votes1).toBeGreaterThanOrEqual(votes2)
            }
        })
    })
    test('endpoint should accept queries to order either ascending or descending', () => {
        return request(app)
        .get('/api/reviews?order=asc')
        .then(({body}) => {
            for(let i = 1; i < body.reviews.length; i++) {
                const date1 = parseInt(body.reviews[i - 1].created_at.replace(/[^0-9]/g, ''))
                const date2 = parseInt(body.reviews[i].created_at.replace(/[^0-9]/g, ''))
                
                expect(date1).toBeLessThanOrEqual(date2)
            }
        })
    })
    test('endpoint should accept queries to filter by category', () => {
        return request(app)
        .get('/api/reviews?category=dexterity')
        .then(({body}) => {
            expect(body.reviews).toEqual([
                {
                    title: "Kerplunk; Don't lose your marbles",
                    designer: 'Avery Wunzboogerz',
                    owner: 'tickle122',
                    review_img_url:
                      'https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                    review_body:
                      "Don't underestimate the tension and supsense that can be brought on with a round of Kerplunk! You'll feel the rush and thrill of not disturbing the stack of marbles, and probably utter curse words when you draw the wrong straw. Fanily friendly, and not just for kids! ",
                    category: 'dexterity',
                    comment_count: "3",
                    review_id: 13,
                    created_at: "2021-01-25T11:16:54.963Z",
                    votes: 9
                },
                {
                    title: 'Super Rhino Hero',
                    designer: 'Gamey McGameface',
                    owner: 'jessjelly',
                    review_img_url:
                    'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                    review_body:
                    'Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod',
                    category: 'dexterity',
                    comment_count: "2",
                    review_id: 10,
                    created_at: "2021-01-22T11:35:50.936Z",
                    votes: 7
                },
                {
                    title: 'JengARRGGGH!',
                    designer: 'Leslie Scott',
                    owner: 'grumpy19',
                    review_img_url:
                      'https://images.pexels.com/photos/4009761/pexels-photo-4009761.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
                    review_body:
                      "Few games are equiped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn't-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explaination. Whether you're a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.",
                    category: 'dexterity',
                    comment_count: "3",
                    review_id: 2,
                    created_at: "2021-01-18T10:01:41.251Z",
                    votes: 5
                }
            ])
        })
    })
    test('endpoint should accept all types of query together', () => {
        return request(app)
        .get('/api/reviews?category=dexterity&sort_by=owner&order=asc')
        .then(({body}) => {
            expect(body.reviews).toEqual([
                {
                    title: 'JengARRGGGH!',
                    designer: 'Leslie Scott',
                    owner: 'grumpy19',
                    review_img_url:
                    'https://images.pexels.com/photos/4009761/pexels-photo-4009761.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
                    review_body:
                    "Few games are equiped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn't-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explaination. Whether you're a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.",
                    category: 'dexterity',
                    comment_count: "3",
                    review_id: 2,
                    created_at: "2021-01-18T10:01:41.251Z",
                    votes: 5
                },
                {
                    title: 'Super Rhino Hero',
                    designer: 'Gamey McGameface',
                    owner: 'jessjelly',
                    review_img_url:
                    'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                    review_body:
                    'Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod',
                    category: 'dexterity',
                    comment_count: "2",
                    review_id: 10,
                    created_at: "2021-01-22T11:35:50.936Z",
                    votes: 7
                },
                {
                    title: "Kerplunk; Don't lose your marbles",
                    designer: 'Avery Wunzboogerz',
                    owner: 'tickle122',
                    review_img_url:
                      'https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                    review_body:
                      "Don't underestimate the tension and supsense that can be brought on with a round of Kerplunk! You'll feel the rush and thrill of not disturbing the stack of marbles, and probably utter curse words when you draw the wrong straw. Fanily friendly, and not just for kids! ",
                    category: 'dexterity',
                    comment_count: "3",
                    review_id: 13,
                    created_at: "2021-01-25T11:16:54.963Z",
                    votes: 9
                }
            ])
        })
    })
    test(`should return status 400 and "Bad request" whenever sort_by doesn't match the columns on the table`, () => {
        return request(app)
        .get('/api/reviews?sort_by=I_AM_HACKERMAN')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad request'})
        })
    })
    test(`should return status 400 and "Bad request" whenever order is not "asc" or "desc"`, () => {
        return request(app)
        .get('/api/reviews?order=THIS_IS_SQL_INJECTION')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad request'})
        })
    })
    test(`should return status 404 and "Not found" whenever category doesn't match the categories which exist`, () => {
        return request(app)
        .get('/api/reviews?category=MUAHAHAHA')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Not Found'})
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
    test('should respond with status 400 and an error message if the comment property is empty', () => {
        return request(app)
        .post('/api/reviews/1/comments')
        .send({username: 'weegembump', body: ''})
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad request'})
        })
    })
    test('should respond with status 400 and an error message if the object is not in the expected form', () => {
        return request(app)
        .post('/api/reviews/1/comments')
        .send({username: 'weegembump'})
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

describe('DELETE /api/comments/:comment_id', () => {
    test('endpoint should delete the comment with the specified ID and return status 204 and no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({})
            return request(app)
            .get('/api/reviews/2/comments')
        })
        .then(({body}) => {
            expect(body).toEqual({
                comments: [
                  {
                    comment_id: 4,
                    body: 'EPIC board game!',
                    review_id: 2,
                    author: 'tickle122',
                    votes: 16,
                    created_at: '2017-11-22T12:36:03.389Z'
                  },
                  {
                    comment_id: 10,
                    body: 'Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim.',
                    review_id: 2,
                    author: 'grumpy19',
                    votes: 9,
                    created_at: '2021-03-27T14:15:31.110Z'
                  }
                ]
              })
        })
    })
    test('should respond with 404 and a message if there is no comment with that ID', () => {
        return request(app)
        .delete('/api/comments/9001')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Not found'})
        })
    })
    test('should respond with 400 and a message if the comment ID is not an integer', () => {
        return request(app)
        .delete('/api/comments/time_for_tea')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad request'})
        })
    })
})