const express = require('express');
const { getCategories } = require('./controllers/app.controllers');
const { handleInternalServerErrors } = require('./controllers/errors.controllers');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);

app.use(handleInternalServerErrors);

module.exports = app;
