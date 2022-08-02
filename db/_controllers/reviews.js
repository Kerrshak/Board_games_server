const {fetchReview, updateReview} = require('../_models/reviews')
const {fetchComments} = require('../_models/comments')

exports.getReview = ((req, res, next) => {
    const id = req.params.review_id
    let reviewStored

    return fetchReview(id)
    .then((review) => {
        reviewStored = review
        return fetchComments(id)
    })
    .then((comments) => {
        reviewStored.rows[0].comment_count = comments.rowCount
        console.log('Review', reviewStored.rows[0])
        res.status(200).send({review: reviewStored.rows[0]})
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