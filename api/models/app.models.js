const db = require('../../db/connection');

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories').then((categories) => {
        return categories.rows;
    })
};

exports.fetchReviews = () => {
    const queryStr = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id;
    `
    return db.query(queryStr).then(({rows}) => {
        const reviewsToReturn = rows.map((review) => {
            review.comment_count = parseInt(review.comment_count);
            return review;
        })
        return reviewsToReturn;
    })
}

exports.fetchReviewByID = (review_id) => {
    const queryValuesArr = [review_id]
    
    return db.query('SELECT review_id FROM comments').then(({rows}) => {
        let queryStr = '';
        for (let i = 0; i < rows.length; i++){
            if (parseInt(rows[i].review_id) === parseInt(review_id)){
                return queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count 
                FROM reviews 
                JOIN comments
                ON reviews.review_id = comments.review_id
                WHERE reviews.review_id = $${queryValuesArr.length}
                GROUP BY reviews.review_id;`;
            }
        }
        return queryStr = `SELECT * FROM reviews WHERE review_id = $${queryValuesArr.length};`
    
    }).then((queryStr) => {
        return db.query(queryStr, queryValuesArr).then(({rows}) => {
            if (rows.length === 0){
                return Promise.reject({status: 404, msg: 'Review not found'})
            } else {
                rows[0].comment_count = parseInt(rows[0].comment_count);

                if (!rows[0].comment_count){
                    rows[0].comment_count = 0
                }
                return rows[0];
            }
        })
    })
}

exports.editReview = (review_id, patchData) => {
    const queryStr = `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`;
    return db.query(queryStr, [patchData.inc_votes, review_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Review not found'})
        } else {
            return rows[0];
        }
    });
}

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users').then((users) => {
        return users.rows;
    })
}