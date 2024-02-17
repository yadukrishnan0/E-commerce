const { Module } = require("module");
require("dotenv").config();

const catagoryModel = require("../models/adminSchema/catagorySChma");
const fs = require("fs");
const moment = require("moment");

const { constants } = require("buffer");
const { render } = require("ejs");
const session = require("express-session");
require("dotenv").config();
const { json } = require("stream/consumers");

module.exports = {
  addCatagory: (req, res) => {
    try {
      res.status(200).render("admin/addcatagory");
    } catch (err) {
      console.log("catagory get", err);

      res.status(404).send("page not found");
    }
  },
  addCatagoryPost: async (req, res) => {
    try {
      const { subCategory, categoryName } = req.body;
      const newsubCata = JSON.parse(subCategory);
      const newcatagory = JSON.parse(categoryName);
      const catagoryImage = req.file.filename;

      const newdata = new catagoryModel({
        subCategory: newsubCata,
        categoryName: newcatagory,
        catagoryImage,
      });
      await newdata.save();
      res.status(230).redirect("/admin/categoryList");
    } catch (err) {
      console.log("add catagory error", err);
      res.status(500).json({ success: false });
    }
  },

  categoryList: async (req, res) => {
    try {
      const categorys = await catagoryModel.find({});
      res.render("admin/categoryList", { categorys });
    } catch (err) {
      console.log("caegory list error", err);
    }
  },

  deletecategory: async (req, res) => {
    try {
      const id = req.query.id;
      const category = await catagoryModel.findOne({ _id: id });
      const imagePath = "./public/" + "Productimag/" + category.catagoryImage;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      await catagoryModel.deleteOne({ _id: id });
      res.status(200).json({ success: true, message: "successfully deleted" });
    } catch (err) {
      console.log("deletecategory err", err);
    }
  },
  editcategory: async (req, res) => {
    try {
      const _id = req.query.id;
      const catagory = await catagoryModel.findOne({ _id });
      res.render("admin/editcategory", { catagory });
    } catch (err) {
      console.log("edit categoty err", err);
    }
  },
  deletesubcategry: async (req, res) => {
    try {
      const _id = req.query.id;
      const sub = req.query.sub;

      await catagoryModel.updateOne({ _id }, { $pull: { subCategory: sub } });
      res.status(200).json({ success: true, message: "successfully deleted" });
    } catch (err) {
      console.log("delete subcategory err", err);
    }
  },
  updateCategory: async (req, res) => {
    try {
      const _id = req.query.id;
      const category = await catagoryModel.findOne({ _id });
      const { subCategory, categoryName } = req.body;
      const newsubCata = JSON.parse(subCategory);
      const newcatagory = JSON.parse(categoryName);
      let catagoryImage;
    
      if (!req.file) {
        catagoryImage = category.catagoryImage;
      } else {
        catagoryImage = req.file.filname;
      } 
      

      await catagoryModel.updateOne(
        { _id },
        {
          $addToSet: { subCategory: { $each: newsubCata} },
          $set: { categoryName: newcatagory, catagoryImage: catagoryImage }
        }
      );
      
     res.status(200).redirect("/admin/categoryList")
    } catch (err) {
      console.log("update category err", err);
    }
  },
};
