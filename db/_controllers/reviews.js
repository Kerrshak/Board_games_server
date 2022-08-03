const {fetchReviews, fetchReviewID, updateReview} = require('../_models/reviews')

exports.getReviews = ((res) => {
    return fetchReviews()
    .then((reviews) => {
        res.status(200).send({reviews: reviews.rows})
    })
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