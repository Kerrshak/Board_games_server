const db = require('../connection')

exports.fetchReview = ((id) => {    
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [id])
    .then((review) => {
        if(review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'This review does not exist'})
        } else return review
    })
})

exports.updateReview = ((id, voteInc) => {
    const idString = id.toString()
    const voteString = voteInc.toString()

    return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;', [voteString, idString])
    .then((review) => {
        if(review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'This review does not exist'})
        } else return review
    })
})