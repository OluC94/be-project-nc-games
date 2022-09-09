const db = require('../../db/connection');

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories').then((categories) => {
        return categories.rows;
    })
};

exports.fetchReviews = (category) => {
    const queryValuesArr = []
    let queryStr = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id`;

    if (category){
        queryValuesArr.push(category)
        queryStr += ` WHERE reviews.category = $1`
    }

    queryStr += `
     GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`

    return db.query(queryStr, queryValuesArr).then(({rows}) => {        
        
        if(rows.length === 0) {
            return Promise.all([rows, db.query('SELECT slug FROM categories')])
        } else {
            return Promise.all([rows])
        }
        
    }).then(([reviewRows, categoryList]) => {
        if (categoryList === undefined) {
            const reviewsToReturn = reviewRows.map((review) => {
                review.comment_count = parseInt(review.comment_count);
                return review;
            })
            return reviewsToReturn;
        } 

        const invalidCategoryCheck = categoryList.rows.filter((row) => {
            return row.slug === category
        })
        
        if (invalidCategoryCheck.length > 0){
            return reviewRows
        } else {
            return Promise.reject({status: 404, msg: 'Category not found'})
        }
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

exports.fetchCommentsByReviewID = (review_id) => {
    review_id = parseInt(review_id);
    const queryStr = `
    SELECT * FROM comments
    WHERE review_id = $1;`
    
    return db.query(queryStr, [review_id]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.all([rows, db.query('SELECT review_id FROM reviews')])
        } else {
            return Promise.all([rows])
        }
    }).then(([commentsRows, reviewIDList]) => {
        
        if (reviewIDList === undefined) {
            return commentsRows;
        }
        
        const existingIDCheck = reviewIDList.rows.filter((row) => {
            return row.review_id === review_id;
        })

        if (existingIDCheck.length > 0) {
            return commentsRows
        } else {
            return Promise.reject({status: 404, msg: 'Review not found'})
        }
    })
}

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users').then((users) => {
        return users.rows;
    })
}