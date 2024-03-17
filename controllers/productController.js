const { Module } = require("module");
const { constants } = require("buffer");
const { render } = require("ejs");
const session = require("express-session");
const { json } = require("stream/consumers");
const fs = require("fs");
const moment = require("moment");

require("dotenv").config();

const productModel = require("../models/adminSchema/productSchema");
const catagoryModel = require("../models/adminSchema/catagorySChma");
const reviewModel = require("../models/userSchema/reviewSchema");
const wishlistModel = require("../models/userSchema/wishlistSchema");
const orderModel = require("../models/userSchema/orderSchema");
const { truncate } = require("fs/promises");

module.exports = {
  addproductGet: async (req, res) => {
    try {
      if (req.session.admin) {
        const data = await catagoryModel.find({});
        res.render("admin/addproducts", { data });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({ success: false });
    }
  },
  addproductPost: async (req, res) => {
    try {
      if (!req.files || req.files.length > 5) {
        return res
          .status(230)
          .json({ ERR: "Please provide a image", success: false });
      }

      const productImage = req.files.map((file) => file.filename);
      const {
        productName,
        price,
        discount,
        stock,
        category,
        subCategory,
        colour,
        size,
        description,
      } = req.body;

      const newdata = new productModel({
        productName,
        price,
        discount,
        stock,
        category,
        subCategory,
        colour,
        size,
        description,
        productImage,
      });
      // console.log(newdata);
      await newdata.save();
      res.status(230).json({ success: true });
    } catch (err) {
      console.log("add product error", err);
    }
  },

  productsGet: async (req, res) => {
    try {
      if (req.session.admin) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const productsCount = await productModel.countDocuments();
        const totalPages = Math.ceil(productsCount / limit);

    
        const products = await productModel.find({ deleted: false }).skip(skip).limit(limit);

        res.render("admin/productsList", { products,
          currentPage: page,
          itemsPerPage: limit,
          totalPages});
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({ success: false });
    }
  },
  productDelete: async (req, res) => {
    try {
      const _id = req.query.id;
      const product = await productModel.findOne({ _id });

      await productModel.updateOne({ _id }, { $set: { deleted: true } });
      await wishlistModel.updateMany({}, { $pull: { productId: _id } });
      res.status(200).json({ success: true, message: "successfully deleted" });
    } catch (err) {
      res.status(400).json({ success: false });
      console.log("delete product error", err.message);
    }
  },
  updateProductGet: async (req, res) => {
    try {
      if (req.session.admin) {
        const _id = req.query.id;
        const productdata = await productModel.findOne({ _id });
        const data = await catagoryModel.find({});
        res.render("admin/updateProduct", { data, productdata });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("update product get error", err);
    }
  },
  updateProductPost: async (req, res) => {
    try {
      const _id = req.query.id;
      const product = await productModel.findOne({ _id });

      const productImage = req.files.map((file) => file.filename);

      const {
        productName,
        price,
        discount,
        stock,
        category,
        subCategory,
        colour,
        size,
        description,
      } = req.body;
      await productModel.updateOne(
        { _id },
        {
          $set: {
            productName: productName,
            price: price,
            discount: discount,
            stock: stock,
            category: category,
            subCategory: subCategory,
            colour: colour,
            size: size,
            description: description,
            productImage: productImage,
          },
        }
      );
      res
        .status(230)
        .json({ success: true, message: "product update successfully" });
    } catch (err) {
      console.log("update product", err);
    }
  },
  viewsingleProductGet: async (req, res) => {
    try {
      if ("/admin/login") {
        const _id = req.query.id;
        const product = await productModel.findOne({ _id });
        res.render("admin/viewSingleProduct", { product });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("viewsingleproduct admin error", err);
    }
  },
  userSingleproduct: async (req, res) => {
    try {
      const _id = req.query.id;
      const product = await productModel.findOne({ _id });
      const review = await reviewModel
        .findOne({ productId: _id })
        .populate("review.UserId");

      res.render("user/usersingleproduct", { product, review });
    } catch (err) {
      console.log("user single product", err);
    }
  },
  // search products
  searchProduct: async (req, res) => {
    try {
      const Name = req.query.query;
      const category = await catagoryModel.find({});
      const products = await productModel.find({ productName: { $regex: Name, $options: "i" }, deleted: false });


      res.status(200).render("user/allproducts", { products, category });
    } catch (err) {
      console.log("search product err", err);
    }
  },
  MinMaxfilter: async (req, res) => {
    try {
      const { minPrice, maxPrice } = req.body;
      const category = await catagoryModel.find({});

      const products = await productModel.find({ price: { $gte: minPrice, $lte: maxPrice }, deleted: false });

      res.status(200).render("user/allproducts", { products, category });
    } catch (err) {
      console.log("max to minimum error:", err);
    }
  },
  adminSideOrderGet: async (req, res) => {
    try {
      if (req.session.admin) {
        const orders = await orderModel.find({}).sort({ createdAt:-1}).populate("products.productId");

        res.render("admin/orderslist", { orders });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("adminSideOrderGet", err);
    }
  },
  updateStatus: async (req, res) => {
    try {
      let _id;
      let Status;
      if (!req.body.id) {
        // this is user side oder cancel
        _id = req.query.id;
      } else {
        //admin can update the status two side are the same router
        _id = req.body.id;
      }
      if (!req.body.Status) {
        Status = "Cancelled";
      } else {
        Status = req.body.Status;
      }

      await orderModel.updateOne({ _id }, { $set: { Status: Status } });
      res.status(200).json({ success: true, Status });
    } catch (err) {
      console.log("updateStatus error", err);
    }
  },
  reviewGet: async (req, res) => {
    try {
      if (req.session.user) {
        const product = await productModel.findOne({ _id: req.query.id });
        res.render("user/review", { product });
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log("reviewget", err);
    }
  },
  reviewPost: async (req, res) => {
    try {
      const productId = req.query.id;
      const userid = req.session.user;
      const { description } = req.body;
      const review = await reviewModel.findOne({ productId: productId });
      // console.log(review.UserId);
      if (!review) {
        const newdata = new reviewModel({
          productId: productId,
          review: [{ UserId: userid, comment: description }],
        });
        await newdata.save();
        res.redirect("/userOrders");
      } else {
        await reviewModel.updateOne(
          { productId: productId },
          { $push: { review: { UserId: userid, comment: description } } }
        );
        res.redirect("/userOrders");
      }
    } catch (err) {
      console.log("reviewpost", err);
    }
  },
  category: async (req, res) => {
    try {
      const data = req.query.id;
      const products = await productModel.find({ category: data });
      const category = await catagoryModel.find({});
      res.status(200).render("user/allproducts", { products, category });
    } catch (err) {
      console.log("category ", err);
    }
  },
  highTolow: async (req, res) => {
    try {
      const value = JSON.parse(req.body.sort);
      const products = await productModel.find({}).sort({ price:value});
      const category = await catagoryModel.find({});
      res.status(200).render("user/allproducts", { products, category });
    } catch (err) {
      console.log("highTolow", err);
    }
  },
};
