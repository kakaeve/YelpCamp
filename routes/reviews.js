const express = require("express");
const router = express.Router({ mergeParams: true });

const reviews = require("../controllers/reviews");

const catchAsync = require("../utils/catchAsync.js");
const { vaildateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, vaildateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
