//controllers

const {fetchCategories} = require('../_models/categories')

exports.getCategories = (req, res) => {
    return fetchCategories()
        .then((categories) => {
            res.status(200).send({categories})
        })
}