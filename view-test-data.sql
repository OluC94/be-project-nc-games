\c nc_games_test

SELECT * FROM categories;
SELECT * FROM users;
SELECT * FROM reviews;
SELECT * FROM comments;

SELECT reviews.review_id, reviews.title reviews.review_body, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comments.review_id) AS comment_count 
FROM reviews 
JOIN comments
ON reviews.review_id = comments.review_id
WHERE reviews.review_id = 3
GROUP BY reviews.review_id;

SELECT reviews.*, COUNT(comments.review_id) AS comment_count 
FROM reviews 
JOIN comments
ON reviews.review_id = comments.review_id
WHERE reviews.review_id = 3
GROUP BY reviews.review_id;

