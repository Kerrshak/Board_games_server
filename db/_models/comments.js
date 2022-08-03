const db = require('../connection')

exports.fetchComments = ((id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [id])
    .then((review) => {
        if(review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'This review does not exist'})
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