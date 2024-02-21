const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
  productId:[{type:mongoose.Schema.Types.ObjectId,ref:'products'}],
  userId:{type:mongoose.Schema.Types.ObjectId}
 
});

const wishlistModels= mongoose.model("wishlist", wishlistSchema );
module.exports =wishlistModels;
        