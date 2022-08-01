const db = require('../connection')

exports.fetchReview = ((req, res) => {    
    const query = `
        SELECT * FROM reviews
        WHERE review_id = ${req.params.review_id};
    `
    return db.query(query)
    .then((review) => {
        if(review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'This review does not exist'})
        } else return review
    })
})