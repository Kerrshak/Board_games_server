const express = require('express')
const {
    getCategories
} = require('./db/_controllers')
const app = express()

app.get('/api/categories', (req, res) => {
    getCategories(req, res)
})

app.all('/*', (req, res) => {
    res.status(404).send({ msg: "We couldn't find what you were looking for, please try again"})
})

module.exports = app