module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "로그인이 필요합니다.");
    return res.redirect("/login");
  }
  next();
};
