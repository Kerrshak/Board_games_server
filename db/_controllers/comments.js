const {fetchComments, addComment, removeComment} = require('../_models/comments')

exports.getComments = ((req, res, next) => {
    const id = req.params.review_id

    return fetchComments(id)
    .then((comments) => {
        res.status(200).send({comments: comments.rows})
    })
    .catch(next)
})

exports.postComment = ((req, res, next) => {
    const id = req.params.review_id
    const username = req.body.username
    const comment = req.body.body
    const date = new Date(Date.now())

    if(typeof comment === 'undefined') {
        return next({status: 400, msg: 'Bad request'})
    }

    if(comment.length === 0) {
        return next({status: 400, msg: 'Bad request'})
    }

    return addComment(id, username, comment, date)
    .then((comment) => {
        res.status(201).send({comment: comment.rows[0]})
    })
    .catch(next)
})

exports.deleteComment = ((req, res, next) => {
    const id= req.params.comment_id

    return removeComment(id)
    .then(({rowCount}) => {
        if(rowCount === 0){
            return next({status: 404, msg: 'Not found'})
        }
        res.status(204).send({})
    })
    .catch(next)
})