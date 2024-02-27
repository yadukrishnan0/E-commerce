const { Module } = require("module");
require("dotenv").config();

const productModel = require("../models/adminSchema/productSchema");
const catagoryModel = require("../models/adminSchema/catagorySChma");
const fs = require("fs");
const moment = require("moment");

const { constants } = require("buffer");
const { render } = require("ejs");
const session = require("express-session");
require("dotenv").config();
const { json } = require("stream/consumers");

module.exports = {
  addproductGet: async (req, res) => {
    try {
      const data = await catagoryModel.find({});
      res.render("admin/addproducts", { data });
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
      const products = await productModel.find({});

      res.render("admin/productsList", { products });
    } catch (err) {
      console.log(err);
      res.status(404).json({ success: false });
    }
  },
  productDelete: async (req, res) => {
    try {
  
      const _id = req.query.id;
      const product = await productModel.findOne({ _id });

      product.productImage.forEach((element) => {
        const imagePath = "./public/" + "Productimag/" + element;

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      await productModel.deleteOne({ _id });
      res.status(200).json({ success: true, message: "successfully deleted" });
    } catch (err) {
      res.status(400).json({ success: false });
      console.log("delete product error", err.message);
    }
  },
  updateProductGet: async (req, res) => {
    try {
      const _id = req.query.id;
      const productdata = await productModel.findOne({ _id });
      const data = await catagoryModel.find({});
      res.render("admin/updateProduct", { data, productdata });
    } catch (err) {
      console.log("update product get error", err);
    }
  },
  updateProductPost: async (req, res) => {
    try {
      const productImage = req.files.map((file) => file.filename);
      const _id = req.query.id;
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
      const _id = req.query.id;
      const product = await productModel.findOne({ _id });
      res.render("admin/viewSingleProduct", { product });
    } catch (err) {
      console.log("viewsingleproduct admin error", err);
    }
  },
  userSingleproduct: async (req, res) => {
    try {
      const _id = req.query.id;
      const product = await productModel.findOne({ _id });
      res.render("user/usersingleproduct",{product});
    } catch (err) {
      console.log("user single product", err);
    }
  },
  // search products
  searchProduct: async (req, res) => {
    try {
      const Name = req.query.query;
      const category = await catagoryModel.find({});
   const products =  await productModel.find({
        productName: { $regex: Name, $options: "i" },
      });
    
      res.status(200).render("user/allproducts",{products,category});
    } catch (err) {
      console.log("search product err", err);
    }
  },
};
