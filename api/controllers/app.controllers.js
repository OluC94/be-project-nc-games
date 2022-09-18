const { fetchCategories, fetchReviewByID, fetchUsers, editReview, fetchReviews, fetchCommentsByReviewID, insertCommentByReviewID, removeCommentByCommentID } = require("../models/app.models");

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send({categories})
    }).catch(next);
};

exports.getReviews = (req, res, next) => {
    const { category, sort_by, order } = req.query;
    fetchReviews(category, sort_by, order).then((reviews) => {{
        res.status(200).send({reviews})
    }}).catch(next);
}

exports.getReviewByID = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewByID(review_id).then((review) => {
        res.status(200).send({review})
    }).catch(next);
}

exports.patchReviewByID = (req, res, next) => {
    const { body } = req;
    const {review_id} = req.params;
    editReview(review_id, body).then((editedReview) => {
        res.status(200).send({review: editedReview});
    }).catch(next);
}

exports.getCommentsByReviewID = (req, res, next) => {
    const { review_id } = req.params;
    fetchCommentsByReviewID(review_id).then((comments) => {
        res.status(200).send({comments});
    }).catch(next)
}

exports.postCommentByID = (req, res, next) => {
    const { review_id } = req.params;
    insertCommentByReviewID(review_id, req.body).then((comment) => {
        res.status(201).send({comment});
    }).catch(next);

}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users})
    }).catch(next);
}

exports.deleteCommentByCommentID = (req, res, next) => {
    const {comment_id} = req.params;
    removeCommentByCommentID(comment_id).then(() => {
        res.status(204).send({});
    })
}