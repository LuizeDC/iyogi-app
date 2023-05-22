const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const fnc = module.exports;

fnc.renderRegister = (req, res) => {
  res.render("auth/register");
};

fnc.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash(
        "success",
        `Namaste, ${username}! Welcome to our yogi community. 🧘 `
      );
      console.log(User._id);
      res.redirect("/yogaretreats");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

fnc.loginForm = (req, res) => {
  res.render("auth/login");
};

fnc.loginValid = (req, res) => {
  const { username } = req.body;
  req.flash("success", `Welcome back, ${username}! 🧘🪷`);
  const redirectUrl = res.locals.returnTo || "/yogaretreats";
  res.redirect(redirectUrl);
};

fnc.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "See you in the yoga mat!");
    res.redirect("/yogaretreats");
  });
};
