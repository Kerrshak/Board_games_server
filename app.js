const express = require('express')
const {getCategories} = require('./db/_controllers/categories')
const {getComments, postComment} = require('./db/_controllers/comments')
const {getReviews, getReviewID, patchReview} = require('./db/_controllers/reviews')
const {getUsers} = require('./db/_controllers/users')
const app = express()

app.use(express.json())

app.get('/api/categories', (req, res) => {
    getCategories(req, res)
})

app.get('/api/reviews', (req, res) => {
    getReviews(res)
})

app.get('/api/reviews/:review_id', (req, res, next) => {
    getReviewID(req, res, next)
})
app.patch('/api/reviews/:review_id', (req, res, next) => {
    patchReview(req, res, next)
})

app.get('/api/reviews/:review_id/comments', (req, res, next) => {
    getComments(req, res, next)
})

app.post('/api/reviews/:review_id/comments', (req, res, next) => {
    postComment(req, res, next)
})

app.get('/api/users', (req, res) => {
    getUsers(res)
})

app.all('/*', (req, res) => {
    res.status(404).send({ msg: "We couldn't find what you were looking for, please try again"})
})

app.use((err, req, res, next) => {
    console.log('hello from errors, ', err)
    if(err.code === '22P02') {
        res.status(400).send({msg: 'Bad request'})
    } else next(err, req, res,next)
})

app.use((err, req, res, next) => {
    if(err.code === '23503') {
        res.status(401).send({msg: 'Unauthorized'})
    } else next(err, req, res,next)
})

app.use((err, req, res, next) => {
    res.status(err.status).send({msg: err.msg})
})

module.exports = app