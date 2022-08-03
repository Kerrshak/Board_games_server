const db = require('../connection')

exports.fetchReviews = (() => {
    return db.query('SELECT reviews.review_id, title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, count(comment_id) AS comment_count FROM reviews FULL JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;')
})

exports.fetchReviewID = ((id) => {    
    return db.query('SELECT reviews.review_id, title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, count(comment_id) AS comment_count FROM reviews FULL JOIN comments ON reviews.review_id = comments.review_id  WHERE reviews.review_id = $1 GROUP BY reviews.review_id;', [id])
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