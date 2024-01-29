const { Module } = require("module");
const signupModel = require("../models/userSchema/userSIgnupSchema");
const checkPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
const bcrypt = require("bcrypt");
const { log } = require("console");

module.exports = {
  signupGet: (req, res) => {
    res.render("user/Usersignup", { error: req.flash("error") });
  },
  signupPost: async (req, res) => {
    try {
      console.log(req.body);
      const { fullName, phoneNumber, email, password, confirmpassword} =
        req.body;

      const accExist = await signupModel.findOne({ email });
      const passValidation = checkPass.test(password);

      if (accExist) {
        req.flash("error", "account is already exist");
        return res.redirect("/signup");
      }

      if (!passValidation) {
        req.flash("error", "password format incorrect");
        return res.redirect("/signup");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new signupModel({
        fullName,
        phoneNumber,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.send("singup successfully");
    } catch (err) {
      console.error(err, "signup post error");
      res.status(500).send("Internal Server Error");
    }
  },
};
