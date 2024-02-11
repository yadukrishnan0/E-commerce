const { Module } = require("module");
require("dotenv").config();

const productModel = require("../models/adminSchema/productSchema");
const catagoryModel = require("../models/adminSchema/catagorySChma");

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
      console.log(data);
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
        deliveryDate,
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
        deliveryDate,
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
      const _id = req.params.id;
      await productModel.deleteOne({ _id });
      res.status(200).redirect("/admin/productslist");
    } catch (err) {
      res.status(400).json({ success: false });
      console.log("delete user error", err.message);
    }
  },
};
