const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review.js");
const YogaRetreat = require("../models/yogaretreat");
const { validateReview, isLoggedIn, reviewYogi } = require("../middleware");
const reviewControl = require("../controllers/reviewControl");
const ExpressError = require("../utils/ExpressError");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewControl.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  reviewYogi,
  catchAsync(reviewControl.deleteReview)
);

module.exports = router;
