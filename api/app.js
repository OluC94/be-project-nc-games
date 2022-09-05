const express = require('express');
const { getCategories } = require('./controllers/app.controllers');
const { handleInternalServerErrors } = require('./controllers/errors.controllers');

const app = express();

app.get('/api/categories', getCategories);

app.use(handleInternalServerErrors);

module.exports = app;
