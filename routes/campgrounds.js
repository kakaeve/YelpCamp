const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas.js");
const areaCheck = require("../seeds/area");
const { isLoggedIn } = require("../middleware");

const vaildateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    console.log("/ : ", req.session.returnTo);
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  // console.log("/new : ", req.session);
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  vaildateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    campground.area = areaCheck[campground.location];
    await campground.save();
    req.flash("success", "새로운 캠핑장이 완성되었습니다.");
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    console.log(campground);
    if (!campground) {
      req.flash("error", "해당 캠핑장을 찾을 수 없습니다.");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "해당 캠핑장을 찾을 수 없습니다.");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  vaildateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body.campground };
    data.area = areaCheck[data.location];
    const campground = await Campground.findByIdAndUpdate(id, { ...data });
    req.flash("success", "캠핑장 내용을 수정했습니다.");
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "캠핑장을 삭제했습니다.");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
