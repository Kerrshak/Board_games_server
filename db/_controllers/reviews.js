const {fetchReview, updateReview} = require('../_models/reviews')

exports.getReview = ((req, res, next) => {
    const id = req.params.review_id

    return fetchReview(id)
    .then((review) => {
        res.status(200).send({review: review.rows[0]})
    })
    .catch(next)
})

exports.patchReview = (req, res, next) => {
    const id = req.params.review_id
    let votesObj = null

    req.on('data', (packet) => {
        votesObj = JSON.parse(packet)
    })
    req.on('end', () => {
        if (typeof votesObj.inc_votes !== 'number') {
            next({status: 400, msg: 'Value to increase votes by was in an incorrect format, no changes have been made'})
        } else 
        return updateReview(id, votesObj.inc_votes)
        .then((review) => {
            res.status(200).send({review: review.rows[0]})
        })
        .catch(next)
    })
}