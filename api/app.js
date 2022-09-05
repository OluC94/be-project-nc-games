const express = require('express');
const { getCategories, getReviewByID } = require('./controllers/app.controllers');
const { handleInternalServerErrors, handleBadPath } = require('./controllers/errors.controllers');

const app = express();

app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReviewByID)

app.use(handleBadPath);

app.use(handleInternalServerErrors);

module.exports = app;