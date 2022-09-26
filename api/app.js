const express = require("express");
const {
  getCategories,
  getReviewByID,
  getUsers,
  patchReviewByID,
  getReviews,
  getCommentsByReviewID,
  postCommentByID,
  deleteCommentByCommentID,
  getApi,
} = require("./controllers/app.controllers");
const {
  handleInternalServerErrors,
  handleBadPath,
  handleCustomErrors,
} = require("./controllers/errors.controllers");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewByID);
app.patch("/api/reviews/:review_id", patchReviewByID);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);
app.post("/api/reviews/:review_id/comments", postCommentByID);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentByCommentID);

app.use(handleCustomErrors);
app.use(handleBadPath);

app.use(handleInternalServerErrors);

module.exports = app;
