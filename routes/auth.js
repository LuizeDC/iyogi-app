const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { storeReturnTo } = require("../middleware");
const authControl = require("../controllers/authControl");

router
  .route("/register")
  .get(authControl.renderRegister)
  .post(catchAsync(authControl.registerUser));

router
  .route("/login")
  .get(authControl.loginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    authControl.loginValid
  );

router.get("/logout", authControl.logout);

module.exports = router;
