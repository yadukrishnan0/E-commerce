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
// const serviceSID = process.env.serviceSID;
// const accountSID = process.env.accountSID;
// const authToken = process.env.authToken;
// const client = require("twilio")(accountSID, authToken);

module.exports={
    adminSignUpGet:async(req,res)=>{
        res.render()
    }
};