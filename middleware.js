const ExpressError = require("./utils/ExpressError");
const YogaRetreat = require("./models/yogaretreat");
const { yrSchema, reviewSchema } = require("./schemas.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in order to do this!");
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateRetreat = (req, res, next) => {
  const { error } = yrSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.originalYogi = async (req, res, next) => {
  const { id } = req.params;
  const retreat = await YogaRetreat.findById(id);
  if (!retreat.yogi.equals(req.user._id)) {
    req.flash("error", "Not authorized!");
    return res.redirect(`/yogaretreats/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.reviewYogi = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.yogi.equals(req.user._id)) {
    req.flash("error", "Not authorized!");
    return res.redirect(`/yogaretreats/${id}`);
  }
  next();
};
