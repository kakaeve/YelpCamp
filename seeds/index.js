const mongoose = require("mongoose");
const cties = require("./cities");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");

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

const sample = (array) => {
  return array[~~(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 100; i++) {
    const rand = ~~(Math.random() * 126);
    const price = Math.floor(Math.random() * 200000) + 10000;
    const camp = new Campground({
      author: "63dfa0026644fa38b53295eb",
      location: `${cties[rand].city}`,
      area: cties[rand].area,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum qui placeat ut distinctio reiciendis odit, fuga autem esse voluptate, odio sint recusandae rerum labore sed a doloribus veritatis aliquid! Aliquam.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
