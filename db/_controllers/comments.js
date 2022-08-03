const {fetchComments} = require('../_models/comments')

exports.getComments = ((req, res, next) => {
    const id = req.params.review_id

    return fetchComments(id)
    .then((comments) => {
        res.status(200).send({comments: comments.rows})
    })
    .catch(next)
})