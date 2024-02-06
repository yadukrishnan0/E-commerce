const { Module } = require("module");
require("dotenv").config();


const productModel = require("../models/adminSchema/productSchema");
const adminModel = require("../models/adminSchema/adminSChema");
const signupModel = require("../models/userSchema/userSIgnupSchema");
const catagoryModel = require("../models/adminSchema/catagorySChma");
const couponModel =require("../models/adminSchema/couponSchema")




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
    try {
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
    } catch (err) {
      console.log("Adminsignup post error", err.message);
    }
  },

  // ..................................admin login............................

  adminLoginGet: (req, res) => {
    try {
      res.status(200).render("admin/adminLogin", { error: req.flash("error") });
    } catch (err) {
      console.log("admin login get error", err);
    }
  },
  adminLoginPost: async (req, res) => {
    try {
      const { email, password } = req.body;

      const accExist = await adminModel.findOne({ email });

      const passmatch = await bcrypt.compare(password, accExist.password);

      if (!accExist) {
        req.flash("error", "please create account");
        return res.redirect("/admin/login");
      } else if (!passmatch && accExist) {
        req.flash("error", "password incorrect");
        return res.redirect("/admin/login");
      } else if (accExist && passmatch) {
        res.redirect("/admin/home");
      }
    } catch (err) {
      console.log("admin login error", err);
    }
  },
  AdminHomeGet: async (req, res) => {
    const users = await signupModel.find({});
    res.render("admin/adminHome");
  },

  // ........................product maneaement.....................

  addproductGet:async (req, res) => {
    try {
      const data= await catagoryModel.find({})
      res.render("admin/addproducts",{data});
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
  UsersListGet: async (req, res) => {
    const users = await signupModel.find({});
    res.render("admin/usersList", { users });
  },
  deleteUser: async (req, res) => {
    try {
      const _id = req.params.id;
      await signupModel.deleteOne({ _id });
      res.status(200).redirect("/admin/userslist");
    } catch (err) {
      res.status(400).json({ success: false });
      console.log("delete user error", err.message);
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
      
      const catagoryImage = req.file.filename;

      const newdata = new catagoryModel({
        subCategory,
        categoryName,
        catagoryImage,
      });
      await newdata.save();
      res.status(230).redirect('/admin/home');
  
    } catch (err) {
      console.log("add catagory error", err);
      res.status(500).json({ success: false });
    }
  },
couponGet:(req,res)=>{
  try{
res.status(200).render('admin/addcoupon')
  }
  catch(err){
    console.log('coupon get err',err)
  }
},

couponPost:async(req,res)=>{
  try{
  const{couponCode,upTo,validFrom,validTo}=req.body;
  console.log(req.body);
  const newdata = new couponModel({
    couponCode ,
    upTo,
    validFrom,
    validTo
  });
  await newdata.save();
  res.status(230).redirect('/admin/couponslist');
  }
  catch(err){
    console.log('coupon post err',err)
    res.status(500).send('internal server error')
  }
},


couponlistGet:async(req,res)=>{
  try{
    const data=await couponModel.find({})
    res.render('admin/couponList',{data})
  }
  catch(err){
    res.status(500).send('internal sever eroor')
  }
 
}
};
