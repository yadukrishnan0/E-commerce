const cartModel = require("../models/userSchema/cartSchema");
const productModel = require("../models/adminSchema/productSchema");
const { ObjectId } = require("mongodb");
const { Types } = require("mongoose");
const mongoose = require("mongoose");
module.exports = {
  addTocart: async (req, res) => {
    try {
      if (!req.session.user) {
        res.status(200).json({ login: false, message: "user not login" });
      } else {
        const userId = req.session.user;
        const productid = req.query.id;

        const userObjId = new mongoose.Types.ObjectId(userId);

        const productObjId = new mongoose.Types.ObjectId(productid);

        const cart = await cartModel.findOne({ userId: userObjId });

        if (!cart) {
          const newdata = new cartModel({
            products: { productId: productObjId, quantity: 1 },
            userId: userObjId,
          });
          await newdata.save();
        } else {
          // let productsExists=false
          const productsExists = cart.products.find((item) =>
            item.productId.equals(productObjId)
          );
          // console.log(abc);
          if (!productsExists) {
            await cartModel.updateOne(
              { userId: userObjId },
              { $push: { products: { productId: productObjId, quantity: 1 } } }
            );
          }
        }
        res.status(200).json({ success: true, message: "add to cart" });
      }
    } catch (err) {
      console.log("add to cart err", err);
    }
  },
  showaddtocart: async (req, res) => {
    try {
      const userId = req.session.user;
      if (!userId) {
        console.log("user is not login");
        res.status(404).json({ success: false, msg: "user not login" });
      } else {
        const cart = await cartModel.find({ userId });
        const cartlist = [];
        cart.forEach((element) => {
          element.products.forEach(async (product) => {
            cartlist.push(product.productId);
          });
        });

        res.status(200).json({ success: true, cartlist });
      }
    } catch (err) {
      console.log("show add to cart  eror", err);
    }
  },
  cartlist: async (req, res) => {
    try {
      const { user } = req.session;
      if (!user) return res.redirect("/login");
      const cart = await cartModel
        .findOne({ userId: user })
        .populate("products.productId");
        if(cart&&cart.products.length>0){
      const totalAmt=  cart.products.reduce((accu,data)=>{
        const result = (data.productId.price * data.productId.discount) / 100;
        const discountedPrice = Math.ceil(data.productId.price - result);
       return accu+= discountedPrice * data.quantity;
      
        },0)
        res.render("user/cart", {cart,totalAmt});
      }else{
        
        res.render("user/cart", {cart,totalAmt:0});
      }
    } catch (err) {
      console.log("cartlist err", err);
    }
  },
  deleteCart: async (req, res) => {
    try {
      const id = req.query.id;
      const userId = req.session.user;

      await cartModel.updateOne(
        { userId },
        { $pull: { products: { productId: id } } }
      );
      const cart = await cartModel.findOne({ userId });
      let length = cart.products.length;
      res
        .status(200)
        .json({ success: true, message: " product deleted", length });
    } catch (err) {
      console.log("delete cart error", err);
    }
  },
  cartQtyUpdate: async (req, res) => {
    try {
      const userId = req.session.user;
      const productid = req.body.productid;
      const qty = req.body.qty;
      await cartModel.updateOne(
        { userId, "products.productId":productid},
        { "products.$.quantity":qty} 
        );
      res.status(200).json({success:true,message:'quantity updated'})
    } catch (err) {
      console.log("cart quantity Update", err);
    }
  },
};
