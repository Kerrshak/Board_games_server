const db = require('../connection')

exports.fetchComments = ((id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [id])
    .then((review) => {
        if(review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not found'})
        } else return
    })
    .then(() => {
        return db.query('SELECT * FROM comments WHERE review_id = $1;', [id])
    })
    .then((comments) => {
        if(comments.rows.length === 0) {
            return Promise.reject({status: 200, msg: 'No comments exist on this review'})
        } else return comments
    })
})

exports.addComment = ((id, username, comment, date) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [id])
    .then((review) => {
        if(review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not found'})
        } else return
    })
    .then(() => {
        return db.query('INSERT INTO comments (body, votes, author, review_id, created_at) VALUES($1, 0, $2, $3, $4) RETURNING *;', [comment, username, id, date])
    })
})

