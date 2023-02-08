const mongoose = require("mongoose");
const cties = require("./cities");
const lnglat = require("./lnglat");
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
  for (let i = 0; i < 500; i++) {
    //cties
    // const rand = ~~(Math.random() * 126);
    //lnglat
    const rand = ~~(Math.random() * 295);
    const price = Math.floor(Math.random() * 200000) + 10000;
    const camp = new Campground({
      //노트북용
      //author: "63dfa0026644fa38b53295eb",
      //데스크톱용
      author: "63e1c9dec0e00f709b6e82b8",
      //cties
      // location: `${cties[rand].city}`,
      // area: cties[rand].area,
      //lnglat
      location: `${lnglat[rand].city}`,
      area: lnglat[rand].do,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dzylnkhwu/image/upload/v1675775510/YelpCamp/m8vmmwuqkavrjsn6y71v.jpg",
          filename: "YelpCamp/m8vmmwuqkavrjsn6y71v",
        },
        {
          url: "https://res.cloudinary.com/dzylnkhwu/image/upload/v1675775510/YelpCamp/ycqms2ijdldbth5iiplg.jpg",
          filename: "YelpCamp/ycqms2ijdldbth5iiplg",
        },
      ],
      description:
        "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum qui placeat ut distinctio reiciendis odit, fuga autem esse voluptate, odio sint recusandae rerum labore sed a doloribus veritatis aliquid! Aliquam.",
      price,
      geometry: {
        type: "Point",
        coordinates: [lnglat[rand].longitude, lnglat[rand].latitude],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
