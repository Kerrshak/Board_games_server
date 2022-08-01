//controllers  CHANGE FILE NAME TO CATEGORIES

const {
    fetchCategories
} = require('../_models')

exports.getCategories = (req, res) => {
    return fetchCategories()
        .then((categories) => {
            res.status(200).send({categories})
        })
}