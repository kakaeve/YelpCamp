const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  area: String,
  description: String,
  location: String,
});
module.exports = mongoose.model("Campground", CampgroundSchema);
