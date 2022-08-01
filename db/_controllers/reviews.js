const {fetchReview} = require('../_models/reviews')

exports.getReview = ((req, res, next) => {
    const id = req.params.review_id
    return fetchReview(id)
    .then((review) => {
        res.status(200).send({review: review.rows[0]})
    })
    .catch(next)
})