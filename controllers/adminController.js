const { Module } = require("module");
require("dotenv").config();

const productModel = require("../models/adminSchema/productSchema");
const adminModel = require("../models/adminSchema/adminSChema");


const nodemailer = require("nodemailer");
const { constants } = require("buffer");
const { render } = require("ejs");
const session = require("express-session");
require("dotenv").config();

const checkPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
const bcrypt = require("bcrypt");
const otp = require("../public/js/optgenerator");

module.exports = {
//  ..............admin signup............................
  adminSignUpGet: async (req, res) => {
    res.render("admin/adminSign", { error: req.flash("error") });
  },
  adminsignupPost: async (req, res) => {
    const { fullName, email, confirmPassword, password, code } = req.body;
    const secretCode = process.env.code;
    const secretTrue = secretCode == code;
    const passValidation = checkPass.test(password);
    const accExist = await adminModel.findOne({ email });
    if (accExist) {
      req.flash("error", "account is already exist");
      return res.redirect("/admin/signup");
    } else if (!passValidation) {
      req.flash("error", "password format incorrect");
      return res.redirect("/admin/signup");
    } else if (!accExist && passValidation && secretTrue) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new adminModel({
        fullName,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.redirect("/admin/login");
    }
  },

  // ..................................admin login............................

  adminLoginGet: (req, res) => {
    res.render("admin/adminLogin", { error: req.flash("error") });
  },
  adminLoginPost: async (req, res) => {
    const { email, password } = req.body;

    const accExist = await adminModel.findOne({ email });
    const passmatch = await bcrypt.compare(password, accExist.password);

    if (!accExist) {
      req.flash("error", "please create account");
      return res.redirect("/admin/login");
    } else if (!passmatch && accExist) {
      req.flash("error", "password incorrec");
      return res.redirect("/admin/login");
    } else if (accExist && passmatch) {
      res.send("login successfully");
    }
  },

  // ........................product maneaement.....................

  addproductGet: (req, res) => {
    res.render("admin/addproducts");
  },
  addproductPost:async (req, res) => {  
 
    if(!req.files || req.files.length > 5){
      return res.status(230).json({ERR:"Please provide a image",success:false})
    }

    const productImage=req.files.filename;
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

   const newdata = new  productModel({
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
    productImage
   });
   await newdata.save();
   res.status(230).json({success:true})


  
 },
};
