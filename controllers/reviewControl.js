const YogaRetreat = require("../models/yogaretreat");
const Review = require("../models/review.js");
const fnc = module.exports;

fnc.createReview = async (req, res) => {
  const yogaretreat = await YogaRetreat.findById(req.params.id);
  const review = new Review(req.body.review);
  review.yogi = req.user._id;
  yogaretreat.reviews.push(review);
  await review.save();
  await yogaretreat.save();
  req.flash("success", "Thank you for leaving a review!");
  res.redirect(`/yogaretreats/${yogaretreat._id}`);
};

fnc.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await YogaRetreat.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/yogaretreats/${id}`);
};
