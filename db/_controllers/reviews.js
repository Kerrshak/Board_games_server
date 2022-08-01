const {fetchReview} = require('../_models/reviews')

exports.getReview = ((req, res, next) => {
    return fetchReview(req, res)
    .then((review) => {
        res.status(200).send({review: review.rows[0]})
    })
    .catch(next)
})