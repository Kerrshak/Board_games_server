const express = require('express')
const {getCategories} = require('./db/_controllers/categories')
const {getReview, patchReview} = require('./db/_controllers/reviews')
const app = express()

app.use(express.json())

app.get('/api/categories', (req, res) => {
    getCategories(req, res)
})

app.get('/api/reviews/:review_id', (req, res, next) => {
    getReview(req, res, next)
})
app.patch('/api/reviews/:review_id', (req, res, next) => {
    patchReview(req, res, next)
})

app.get

app.all('/*', (req, res) => {
    res.status(404).send({ msg: "We couldn't find what you were looking for, please try again"})
})

app.use((err, req, res, next) => {
    console.log('hello from errors, ', err)
    if(err.code === '22P02') {
        res.status(400).send({msg: 'The review ID should take the form of an integer, please try again'})
    } else next(err, req, res,next)
})

app.use((err, req, res, next) => {
    res.status(err.status).send({msg: err.msg})
})

module.exports = app