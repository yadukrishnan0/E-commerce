const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Discription: {
    type: String,
    required: true,
  },
  Expiry: {
    type: Date,
    required: true,
  },
  BannerImage: {
    type: String,
  },
});

const Banner = mongoose.model("Banner", BannerSchema);

module.exports = Banner;
