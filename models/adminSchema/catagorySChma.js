const mongoose = require("mongoose");

const catagorySchema = new mongoose.Schema({
  category: {
    type: String,
  },
  subCategory: {
    type: Array,
  },
  catagoryImage: {
    type:String,
}
});

const catagory = mongoose.model("Products",catagorySchema);

module.exports =catagory;
