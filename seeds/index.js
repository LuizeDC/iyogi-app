const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors, activity } = require("./yogiHelpers");
const YogaRetreatModel = require("../models/yogaretreat");

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/yogaDB")
  .catch((error) => handleError(error));
console.log("YogaDB CONNECTED");

const sample = (array) => array[Math.floor(Math.random() * array.length)];
// const imageSeed = url("https://unsplash.com/pt-br/fotografias/GaprWyIw66o");

const seedDB = async () => {
  await YogaRetreatModel.deleteMany({});
  for (let i = 0; i < 30; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 1000) + 10;
    const newRetreat = new YogaRetreatModel({
      yogi: `64690bc9abbf797811e23530`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(places)} ${sample(descriptors)} ${sample(
        activity
      )}  Retreat`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/djt0xdcf1/image/upload/v1683556078/YogaRetreat/szefllcizxahadisq9gj.jpg",
          filename: "YogaRetreat/szefllcizxahadisq9gj",
        },
        {
          url: "https://res.cloudinary.com/djt0xdcf1/image/upload/v1683556079/YogaRetreat/dnrwbzqxomsifv3itmjx.jpg",
          filename: "YogaRetreat/dnrwbzqxomsifv3itmjx",
        },
        {
          url: "https://res.cloudinary.com/djt0xdcf1/image/upload/v1683556079/YogaRetreat/h4kdnkqdghvltvchblfh.jpg",
          filename: "YogaRetreat/h4kdnkqdghvltvchblfh",
        },
        {
          url: "https://res.cloudinary.com/djt0xdcf1/image/upload/v1683556079/YogaRetreat/ndhgyyulf5vbclwdbelc.jpg",
          filename: "YogaRetreat/ndhgyyulf5vbclwdbelc",
        },
      ],
    });
    await newRetreat.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
