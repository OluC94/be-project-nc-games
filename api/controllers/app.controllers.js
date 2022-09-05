const { fetchCategories, fetchReviewByID } = require("../models/app.models");

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