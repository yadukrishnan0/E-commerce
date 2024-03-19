const { Module } = require("module");
require("dotenv").config();

const adminModel = require("../models/adminSchema/adminSChema");
const signupModel = require("../models/userSchema/userSIgnupSchema");
const catagoryModel = require("../models/adminSchema/catagorySChma");
const productModel = require("../models/adminSchema/productSchema");
const moment = require("moment");

const { constants } = require("buffer");
const { render } = require("ejs");
const session = require("express-session");
require("dotenv").config();

const checkPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
const bcrypt = require("bcrypt");
const otp = require("../public/js/optgenerator");
const { json } = require("stream/consumers");
const orderModel = require("../models/userSchema/orderSchema");
const emailverification = require("../utilities/nodemailer");
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
      req.session.admin = accExist._id;
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
    try {
      if (req.session.admin) {
        const users = await signupModel.find({});
        const products = await productModel.find({});
        const orders = await orderModel.find({ Status: "Delivered" });
        const total = orders.reduce((accu, data) => {
          return (accu += data.totalprice);
        }, 0);
        const data = {
          users: users,
          products: products,
          orders: orders,
          total: total,
        };

        res.render("admin/adminHome", { data });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("adminhome get error", err);
    }
  },

  UsersListGet: async (req, res) => {
    try {
      if (req.session.admin) {
        const users = await signupModel.find({ block: true }, { password: 0 });
        res.render("admin/usersList", { users });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("userslist err", err);
    }
  },
  userblock: async (req, res) => {
    try {
      const _id = req.query.id;

      await signupModel.updateOne({ _id }, { $set: { block: false } });
      res.status(200).json({ success: true, message: "successfully deleted" });
    } catch (err) {
      console.log("user block err", err);
    }
  },
  blocksers: async (req, res) => {
    try {
      if (req.session.admin) {
        const users = await signupModel.find({ block: false });
        res.render("admin/blockedusers", { users });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("blocked users get err", err);
    }
  },
  unblockUser: async (req, res) => {
    try {
      const _id = req.query.id;

      await signupModel.updateOne({ _id }, { $set: { block: true } });
      res.status(200).json({ success: true, message: "successfully deleted" });
    } catch (err) {
      console.log("users unblock err", err);
    }
  },
  adminforgotGet: (req, res) => {
    try {
      res.render("admin/adminforgot", { error: req.flash("error") });
    } catch (err) {
      console.log("adminforgotGet", err);
    }
  },
  adminforgotPost: async (req, res) => {
    try {
      const admin = await adminModel.findOne({ email: req.body.email });
      if (!admin) {
        req.flash("error", "please create account");
        return res.redirect("/admin/adminForgotPassword");
      } else {
        const otp = Math.floor(Math.random() * 900000) + 100000;
        console.log(otp);
        emailverification(req.body.email, otp);
        req.session.adminemail = req.body.email;
        req.session.otp = otp;
        res.redirect("/admin//adminotp");
      }
    } catch (err) {
      console.log(" adminforgotPost", err);
    }
  },
  //admin forgot password otp
  adminOtp: (req, res) => {
    try {
      res.render("admin/adminOtp", { error: req.flash("error") });
    } catch (err) {
      console.log("adminOtp", err);
    }
  },
  adminOtpPost: (req, res) => {
    try {
      if (req.body.otp == req.session.otp) {
        delete req.session.otp;
        res.redirect("/admin/adminupdatepassword");
      } else {
        req.flash("error", "otp is wrong");
        return res.redirect("/admin//adminotp");
      }
    } catch (err) {
      console.log("adminOtpPost", err);
    }
  },
  adminforgotpassGet: (req, res) => {
    try {
      res.render("admin/adminFogotPass", { error: req.flash("error") });
    } catch (err) {
      console.log(err);
    }
  },
  adminforgotpassPost: async (req, res) => {
    try {
      const { Newpassword, confirmpassword } = req.body;
      const passValidation = checkPass.test(confirmpassword);
      if (Newpassword == confirmpassword && passValidation) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(confirmpassword, salt);
        const email = req.session.adminemail;
        await adminModel.updateOne(
          { email },
          { $set: { password: hashedPassword } }
        );
        delete req.session.adminemail;
        res.redirect("/admin/login");
      } else {
        req.flash("error", "your password is wrongg...");
        return res.redirect("/admin/adminupdatepassword");
      }
    } catch (err) {
      console.log(" adminforgotpassPost", err);
    }
  },
  adminlogout: (req, res) => {
    try {
      delete req.session.admin;
      res.redirect("/admin/login");
    } catch (err) {
      console.log("adminlogout", err);
    }
  },
};
