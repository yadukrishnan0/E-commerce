const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
    products: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, quantity: { type: Number },_id:false }],
    userId: { type: mongoose.Schema.Types.ObjectId }
  });
  

const cartModel= mongoose.model("cart",cartSchema );
module.exports =cartModel;
        