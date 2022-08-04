const {fetchReviews, fetchReviewID, updateReview} = require('../_models/reviews')

exports.getReviews = ((req, res, next) => {
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
    const greenLitCategories = ['strategy', 'hidden-roles', 'dexterity', 'push-your-luck', 'roll-and-write', 'deck-building', 'engine-building']
    
    const isSortByRed = !greenLitSort.hasOwnProperty(req.query.sort_by) && typeof req.query.sort_by !== 'undefined'
    const isOrderRed = req.query.order !== ('asc' || 'desc') && typeof req.query.order !== 'undefined'
    const isCategoryRed = !greenLitCategories.includes(req.query.category) && typeof req.query.category !== 'undefined'

    if(isSortByRed || isOrderRed || isCategoryRed){
        return next({status: 400, msg: 'Bad request'})
    }
    
    const sortBy = greenLitSort[req.query.sort_by]
    const order = req.query.order
    let category = undefined

    if(typeof req.query.category !== 'undefined') {
        category = `WHERE category = '${req.query.category}'`
    }

    return fetchReviews(sortBy, order, category)
    .then((reviews) => {
        res.status(200).send({reviews: reviews.rows})
    })
    .catch(next)
})

exports.getReviewID = ((req, res, next) => {
    const id = req.params.review_id

    return fetchReviewID(id)
    .then((review) => {
        res.status(200).send({review: review.rows[0]})
    })
    .catch(next)
})

exports.patchReview = (req, res, next) => {
    const id = req.params.review_id
    const voteInc = req.body.inc_votes

    if (typeof voteInc !== 'number') {
        next({status: 400, msg: 'Value to increase votes by was in an incorrect format, no changes have been made'})
    } else 
    return updateReview(id, voteInc)
    .then((review) => {
        res.status(200).send({review: review.rows[0]})
    })
    .catch(next)
}