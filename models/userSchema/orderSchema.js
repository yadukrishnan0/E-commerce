const mongoose = require("mongoose");
const { type } = require("os");
const orderSchema = mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId },
    products: [{productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, quantity: { type: Number },_id:false }],
    totalprice:Number,
    address:String,
    paymentMethod:String,
    Status:String
  },{timestamps:true});
  

const orderModel= mongoose.model("orders",orderSchema);
module.exports =orderModel;
        