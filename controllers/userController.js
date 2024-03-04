const { Module } = require("module");
require("dotenv").config();
const signupModel = require("../models/userSchema/userSIgnupSchema");
const nodemailer = require("nodemailer");

const { constants } = require("buffer");
const { render } = require("ejs");
const session = require("express-session");
require("dotenv").config();

const checkPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
const bcrypt = require("bcrypt");

const emailverification = require("../utilities/nodemailer");
const productModel = require("../models/adminSchema/productSchema");
const profileModel = require("../models/userSchema/profie");
const { ObjectId } = require("mongodb");
const { Types } = require("mongoose");
const mongoose = require("mongoose");

const otp = Math.floor(Math.random() * 900000) + 100000;

const serviceSID = process.env.serviceSID;
const accountSID = process.env.accountSID;
const authToken = process.env.authToken;

const client = require("twilio")(accountSID, authToken);
const catagoryModel = require("../models/adminSchema/catagorySChma");

module.exports = {
  //........................................... .........signup.................................................//

  signupGet: (req, res) => {
    res.render("user/Usersignup", { error: req.flash("error") });
  },
  signupPost: async (req, res) => {
    try {
      // console.log(req.body);
      const { fullName, phoneNumber, email, password, confirmpassword } =
        req.body;

      const accExist = await signupModel.findOne({ email });
      const passValidation = checkPass.test(password);

      if (accExist) {
        req.flash("error", "account is already exist");
        return res.redirect("/signup");
      } else if (!passValidation) {
        req.flash("error", "password format incorrect");
        return res.redirect("/signup");
      } else if (!accExist && passValidation) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new signupModel({
          fullName,
          phoneNumber,
          email,
          password: hashedPassword,
        });

        await newUser.save();
      }

      const mobile = parseInt(phoneNumber);

      verification = await client.verify.v2
        .services(serviceSID)
        .verifications.create({
          to: `+91${mobile}`,
          channel: "sms",
        });

      const ph = `+91${mobile}`;

      const data = { ph: ph, email: email };

      req.flash("data", data);

      return res.status(20).redirect("/otp");
    } catch (err) {
      console.error(err.message, "signup post error", err);
      res.status(500).send("Internal Server Error");
    }
  },
  otpGet: (req, res) => {
    res.render("user/otp", { data: req.flash("data")[0] });
  },
  otpPost: async (req, res) => {
    const { otp, phone, email } = req.body;
    // console.log(req.body)
    try {
      const verification_check = await client.verify.v2
        .services(serviceSID)
        .verificationChecks.create({ to: phone, code: otp });

      if (verification_check.status === "approved") {
        const users = await signupModel.findOneAndUpdate(
          { email },
          { $set: { role: true } }
        );

        res.redirect("/login");
      } else {
        console.log("failed");
        res.redirect("/signup");
      }
    } catch (err) {
      console.error(err.message, "otp post error");
      res.status(500).send("Internal Server Error");
    }
  },

  //..............................login..............................//
  loginGet: (req, res) => {
    res.render("user/login", { error: "" });
  },
  loginPost: async (req, res) => {
    const { email, password } = req.body;
    try {
      const accExist = await signupModel.findOne({ email });
      const passmatch = await bcrypt.compare(password, accExist.password);

      if (!accExist) {
        res.render("user/login", { error: "please create acccount" });
      } else if (!passmatch && accExist) {
        res.render("user/login", { error: "password incorrect" });
      } else if (!accExist.block) {
        res.render("user/login", { error: "your account blocked" });
      } else if (accExist.role && passmatch && accExist.block) {
        req.session.user = accExist._id;

        res.status(200).redirect("/home");
      }
    } catch (err) {
      console.error(err.message, "login post error", err);
      res.status(500).send("Internal Server Error");
    }
  },
  logout: (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        } else {
          console.log("session destroy");
          res.redirect("/login");
        }
      });
    } catch (err) {
      console.log("logout error");
    }
  },
  // .........................................forgot password.......................................................//

  forGet: (req, res) => {
    res.render("user/forgot");
  },
  forgPost: async (req, res) => {
    try {
      const { email } = req.body;
      const account = await signupModel.findOne({ email });

      if (account) {
        req.session.email = email;

        emailverification(email, otp);
        res.redirect("/forgotOtp");
      }
    } catch (err) {
      console.error(err.message, "forg post error");
      res.status(500).send("Internal Server Error");
    }
  },

  forgetOtpverifiGet: (req, res) => {
    res.render("user/verifiOtp");
  },

  forgototpPOst: (req, res) => {
    const { otpc, email } = req.body;
    if (otpc == otp) {
      res.redirect("/resetPassword");
    } else {
      res.redirect("/forgotOtp");
    }
  },

  ResetPassGet: (req, res) => {
    res.render("user/resetPass");
  },
  resetpassPost: async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    try {
      const email = req.session.email;
      const verifyPass = newPassword === confirmPassword;
      const accTrue = await signupModel.findOne({ email });

      if (verifyPass && accTrue) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(confirmPassword, salt);

        await signupModel.updateOne(
          { email },
          {
            $set: {
              password: hashedPassword,
              role: true,
            },
          }
        );
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
          } else {
            console.log("Session deleted successfully");
          }
          res.redirect("/login");
        });
      } else {
        res.status(400).redirect("/resetPassword");
      }
    } catch (err) {
      console.error(err.message, "ressetpassword post error");
      res.status(500).send("Internal Server Error");
    }
  },

  userHomeGet: async (req, res) => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const category = await catagoryModel.find({});
      const products = await productModel
        .find({ createdAt: { $gte: oneWeekAgo } })
        .sort({ createdAt: -1 })
        .limit(4);
      res.render("user/userHome", { products, category });
    } catch (err) {
      console.log("userhome get error", err);
    }
  },
  shopbycategoryGet: async (req, res) => {
    try {
      const category = await catagoryModel.find({});
      const products = await productModel.find({});
      res.render("user/allproducts", { category, products });
    } catch (er) {
      console.log("shop by category error", err);
    }
  },
  userAcctGet: async (req, res) => {
    try {
      const _id = req.session.user;
      if (_id) {
        const user = await signupModel.findOne({ _id });
        // const address =await profileModel.findOne({userId:_id})
        res.status(200).render("user/userProfile", { user });
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log("useraccount get error:", err);
    }
  },
  userAccUpdate: async (req, res) => {
    try {
      const _id = req.session.user;
     
      if (_id) {
        const user=await signupModel.findOne({_id});
        res.render('user/Accupdate',{user});
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log("user account update", err);
    }
  },
  addAddressGet: async (req, res) => {
    try {
      if (req.session.user) {
        res.render("user/addAddress");
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log("add address get err", err);
    }
  },
  editaddresslist: async (req, res) => {
    try {
      if (req.session.user) {
        const userId = req.session.user;
        const userprofile = await profileModel
          .findOne({ userId })
          .populate("userId");
        res.render("user/editaddress", { userprofile });
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log("edit address list get error", err);
    }
  },

  addAddressPost: async (req, res) => {
    try {
      const userId = req.session.user;
      const { house, country, altnumber, district, state, city, hNo, pin } =
        req.body;
      const userObjId = new mongoose.Types.ObjectId(userId);
      const userprofile = await profileModel.findOne({ userId: userObjId });
      if (!userprofile) {
        const newdata = new profileModel({
          userId: userObjId,
          addresses: {
            address: house,
            city: city,
            house_No: hNo,
            altr_number: altnumber,
            postcode: pin,
            country: country,
            district: district,
            state: state,
          },
        });
        await newdata.save();
        res.status(200).redirect("/userEditAddress");
      } else {
        await profileModel.updateOne(
          { userId: userObjId },
          {
            $push: {
              addresses: {
                address: house,
                city: city,
                house_No: hNo,
                altr_number: altnumber,
                postcode: pin,
                country: country,
                district: district,
                state: state,
              },
            },
          }
        );
        res.status(200).redirect("/userEditAddress");
      }
    } catch (err) {
      console.log("addAddress ", err);
    }
  },
  deleteaddress: async (req, res) => {
    try {
      const id = req.query.id;
      const userId = req.session.user;

      await profileModel.updateOne(
        { userId },
        { $pull: { addresses: { _id: id } } }
      );
      res.status(200).json({ success: true, message: "address deleted" });
    } catch (err) {
      console.log("delete address err", err);
    }
  },
};
