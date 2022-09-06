const db = require('../../db/connection');

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories').then((categories) => {
        return categories.rows;
    })
};

exports.fetchReviewByID = (review_id) => {
    const queryValuesArr = [review_id]
    // const queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count 
    // FROM reviews 
    // JOIN comments
    // ON reviews.review_id = comments.review_id
    // WHERE reviews.review_id = $${queryValuesArr.length}
    // GROUP BY reviews.review_id;`;

    const queryStr = `SELECT reviews.review_id, reviews.title, reviews.review_body, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comments.review_id) AS comment_count 
    FROM reviews 
    JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $${queryValuesArr.length}
    GROUP BY reviews.review_id;`;



    // const queryStr = `SELECT * FROM reviews WHERE review_id = $${queryValuesArr.length}`;

    return db.query(queryStr, queryValuesArr).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Review not found'})
        } else {
            rows[0].comment_count = parseInt(rows[0].comment_count)
            return rows[0];
        }
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