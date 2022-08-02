const db = require('../connection')

exports.fetchComments = ((id) => {
    return db.query('SELECT * FROM comments WHERE review_id = $1;', [id])
})