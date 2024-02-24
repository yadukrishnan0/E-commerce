const wishlistModel = require("../models/userSchema/wishlistSchema");
const productModel = require("../models/adminSchema/productSchema");
const { ObjectId } = require("mongodb");
const { Types } = require("mongoose");
const mongoose = require("mongoose");

module.exports = {
  wishlist: async (req, res) => {
    try {
      const productid = req.query.id;
      if (!req.session.user) {
        res.status(200).json({ login: false, message: "user not login" });
      } else {
        const _id = req.session.user;
        const userObjId = new mongoose.Types.ObjectId(_id);
        const productObjId = new mongoose.Types.ObjectId(productid);
        const wishlist = await wishlistModel.findOne({ userId: _id });
        if (!wishlist) {
          const newdata = new wishlistModel({
            productId: [productObjId],
            userId: userObjId,
          });
          await newdata.save();
        } else {
          if (!wishlist.productId.includes(productObjId)) {
            await wishlistModel.updateOne(
              { userId: _id },
              { $push: { productId: productObjId } }
            );
          }
        }
        res.status(200).json("added to wishlst");
      }
    } catch (err) {
      console.log("wishlist add error", err);
    }
  },
  removewishlist: async (req, res) => {
    try {
      const productid = req.query.id;

      const userid = req.session.user;

      const data = await wishlistModel.findOneAndUpdate(
        {
          userId: userid,
        },
        { $pull: { productId: productid } }
      );
      const length = data.productId.length - 1;

      res
        .status(200)
        .json({
          removeproduct: true,
          length,
          message: "product remove success",
        });
    } catch (err) {
      console.log("remove wishlist error", err);
    }
  },
  showwishlist: async (req, res) => {
    try {
      const userId = req.session.user;
      if (!userId) {
        res.status(404).json({ success: false, msg: "user not login" });
      } else {
        const wishlist = await wishlistModel.find({ userId });
        res.status(200).json({ success: true, wishlist });
      }
    } catch (err) {
      console.log("show wish list eror", err);
    }
  },
  wishlistGet: async (req, res) => {
    try {
      const { user } = req.session;
      if (!user) return res.redirect("/login");

      const wishlist = await wishlistModel.findOne({ userId: user });
      let products = [];
      for (const ele of wishlist.productId) {
        let product = await productModel.findOne({ _id: ele });
        products.push(product);
      }
      res.render("user/wishlist", {products});
    } catch (err) {
      console.log("wishlistaget error", err);
    }
  },
};
