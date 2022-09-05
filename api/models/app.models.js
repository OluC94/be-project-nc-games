const db = require('../../db/connection');

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories').then((categories) => {
        return categories.rows;
    })
};

exports.fetchReviewByID = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1', [review_id]).then(({rows}) => {
        return rows[0];
    })
}