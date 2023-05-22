const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const opts = { toJSON: { virtuals: true } };

const yogaRetreatSchema = new Schema(
  {
    title: String,
    images: [{ url: String, filename: String }],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    yogi: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

yogaRetreatSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href="/yogaretreats/${this._id}"><strong>${this.title}</strong></a><br>${this.location}`;
});

yogaRetreatSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

yogaRetreatSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("YogaRetreatModel", yogaRetreatSchema);
