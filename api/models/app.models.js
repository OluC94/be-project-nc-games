const db = require('../../db/connection');

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories').then((categories) => {
        return categories.rows;
    })
};

exports.fetchReviewByID = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1', [review_id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Review not found'})
        } else {
            return rows[0];
        }
    })
}

exports.editReview = (review_id, patchData) => {
    console.log(review_id, patchData);
    const queryStr = `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`;
    return db.query(queryStr, [patchData.inc_votes, review_id])
    .then(({rows}) => {
        return rows[0];
    });
}

// how to catually perform the incrementation
//1 - query the db to retrieve votes for id, then increment and update with new value
//2 - bd query direclty, performing the calculation inline


exports.fetchUsers = () => {
    return db.query('SELECT * FROM users').then((users) => {
        return users.rows;
    })
}