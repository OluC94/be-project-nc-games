const express = require('express');
const { getCategories, getReviewByID, getUsers, patchReviewByID, getReviews, getCommentsByReviewID } = require('./controllers/app.controllers');
const { handleInternalServerErrors, handleBadPath, handleCustomErrors } = require('./controllers/errors.controllers');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewByID);
app.patch('/api/reviews/:review_id', patchReviewByID);
app.get('/api/reviews/:review_id/comments', getCommentsByReviewID)

app.get('/api/users', getUsers);

app.use(handleCustomErrors);
app.use(handleBadPath);

app.use(handleInternalServerErrors);

module.exports = app;
