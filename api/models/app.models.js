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
    return db.query();
}

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users').then((users) => {
        return users.rows;
    })
}