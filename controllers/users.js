const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "yelp캠프에 오신걸 환영합니다.");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};
module.exports.login = (req, res) => {
  const redirectUrl = req.session.returnTo || "/campgrounds";
  req.flash("success", "환영합니다.");
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((e) => {
    if (e) return next(e);
    req.flash("success", "로그아웃되었습니다.");
    res.redirect("/campgrounds");
  });
};
