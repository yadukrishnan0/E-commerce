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

const otp = require("../public/js/optgenerator");
const serviceSID = "VAb9f141d85c5a8e6a938b7bf45631fe57";
const accountSID = "ACe141552ba745d052a4ef1be63e2d7b9a";
const authToken = "0d764961d3f8e3f6e5b0a15cf820b8e5";

const client = require("twilio")(accountSID, authToken);

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

      return res.redirect("/otp");
    } catch (err) {
      console.error(err.message, "signup post error");
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
      } else if (accExist.role && passmatch) {
        res.send("login successfully");
      }
    } catch (err) {
      console.error(err.message, "login post error");
      res.status(500).send("Internal Server Error");
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
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.USER,
            pass: process.env.APP_PASSWORD,
          },
        });

        const mailOption = {
          from: {
            name: "Verification",
            address: "textacc3690@gmail.com",
          },
          to: email,
          subject: "OTP",
          text: `Your OTP is ${otp}`,
        };

        const sendMail = async (transporter, mailOption) => {
          try {
            await transporter.sendMail(mailOption);
            console.log("Mail has been sent successfully");
          } catch (error) {
            console.log(Error`occurred while sending email: ${error}`);
          }
        };
        sendMail(transporter, mailOption);
        // req.flash("error", email);
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

        delete session.email;

        res.redirect("/login");
        console.log("password updated");
      } else {
        res.status(400).redirect("/resetPassword");
      }
    } catch (err) {
      console.error(err.message, "ressetpassword post error");
      res.status(500).send("Internal Server Error");
    }
  },
};
