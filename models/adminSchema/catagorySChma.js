const mongoose = require("mongoose");

const catagorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
  },
  subCategory: {
    type: Array
    },
  catagoryImage: {
    type:String,
}
});

const catagory = mongoose.model("catgory",catagorySchema);

module.exports =catagory;
