const { fetchCategories, fetchReviewByID, fetchUsers } = require("../models/app.models");

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send({categories})
    }).catch(next);
};

exports.getReviewByID = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewByID(review_id).then((review) => {
        res.status(200).send({review})
    }).catch(next);

}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users})
    }).catch(next);
}