const Campground = require("../models/campground");
const areaCheck = require("../seeds/area");

module.exports.index = async (req, res) => {
  console.log("/ : ", req.session.returnTo);
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  campground.area = areaCheck[campground.location];
  await campground.save();
  req.flash("success", "새로운 캠핑장이 완성되었습니다.");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "해당 캠핑장을 찾을 수 없습니다.");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body.campground };
  data.area = areaCheck[data.location];

  const campground = await Campground.findByIdAndUpdate(id, { ...data });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  req.flash("success", "캠핑장 내용을 수정했습니다.");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "캠핑장을 삭제했습니다.");
  res.redirect("/campgrounds");
};
