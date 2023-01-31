const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync.js");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const areaCheck = require("./seeds/area");
const { campgroundSchema } = require("./schemas.js");
const Joi = require("joi");
const ExpressError = require("./utils/ExpressError");

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected!!");
  })
  .catch((err) => {
    console.log(err);
  });

const db = mongoose.connection;

const app = express();
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const vaildateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campground/new");
});

app.post(
  "/campgrounds",
  vaildateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError("캠핑장의 데이터가 없어요", 400);

    const campground = new Campground(req.body.campground);
    campground.area = areaCheck[campground.location];
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campground/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campground/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  vaildateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body.campground };
    data.area = areaCheck[data.location];
    const campground = await Campground.findByIdAndUpdate(id, { ...data });
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("페이지를 찾을 수 없습니다.", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "무언가 잘못 되었습니다.";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {});
