const express = require('express');
const { handleInternalServerErrors } = require('./controllers/errors.controllers');

const app = express();
app.use(express.json());

app.use(handleInternalServerErrors);

