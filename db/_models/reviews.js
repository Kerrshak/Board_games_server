const db = require('../connection')

exports.fetchReviews = ((sortBy = 'created_at', order = 'desc', category = '') => {
    return db.query('SELECT slug FROM categories;')
    .then(({rows}) => {
        const greenLitCategories = ['']
        rows.forEach((row) => {
            greenLitCategories.push(row.slug)
        })
        
        const greenLitSort = {
            review_id: 'reviews.review_id',
            title: 'title',
            designer: 'designer',
            owner: 'owner',
            review_img_url: 'review_img_url',
            review_body: 'review_body',
            category: 'category',
            created_at: 'reviews.created_at',
            votes: 'reviews.votes',
            comment_count: 'comment_count'
        }

        const isSortByRed = !greenLitSort.hasOwnProperty(sortBy)
        const isOrderRed = order !== 'asc' && order !== 'desc'
        const isCategoryRed = !greenLitCategories.includes(category)

        if(isSortByRed || isOrderRed){
            return Promise.reject({status: 400, msg: 'Bad request'})
        }
        
        if(isCategoryRed){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }

        let categoryQuery = ''

        if(category !== '') {
            categoryQuery = `WHERE category = '${category}'`
        }

        return db.query(`SELECT reviews.review_id, title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, count(comment_id) AS comment_count FROM reviews FULL JOIN comments ON reviews.review_id = comments.review_id ${categoryQuery} GROUP BY reviews.review_id ORDER BY ${sortBy} ${order};`)
    })
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