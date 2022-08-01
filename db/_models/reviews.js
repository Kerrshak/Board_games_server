const db = require('../connection')

exports.fetchReview = ((id) => {    
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [id])
    .then((review) => {
        if(review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'This review does not exist'})
        } else return review
    })
})