const {fetchReviews, fetchReviewID, updateReview} = require('../_models/reviews')

exports.getReviews = ((req, res, next) => {
    const sortBy = req.query.sort_by
    const order = req.query.order
    const category = req.query.category

    return fetchReviews(sortBy, order, category)
    .then((reviews) => {
        res.status(200).send({reviews: reviews.rows})
    })
    .catch(next)
})

exports.getReviewID = ((req, res, next) => {
    const id = req.params.review_id

    return fetchReviewID(id)
    .then((review) => {
        res.status(200).send({review: review.rows[0]})
    })
    .catch(next)
})

exports.patchReview = (req, res, next) => {
    const id = req.params.review_id
    const voteInc = req.body.inc_votes

    if (typeof voteInc !== 'number') {
        next({status: 400, msg: 'Value to increase votes by was in an incorrect format, no changes have been made'})
    } else 
    return updateReview(id, voteInc)
    .then((review) => {
        res.status(200).send({review: review.rows[0]})
    })
    .catch(next)
}