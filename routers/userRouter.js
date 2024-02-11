const express = require("express");
const router = express.Router();

const {
  signupGet,
  signupPost,
  otpGet,
  otpPost,
  loginGet,
  forGet,
  forgPost,
  forgetOtpverifiGet,
  forgototpPOst,
  ResetPassGet,
  resetpassPost,
  loginPost,
} = require("../controllers/userController");



router.get("/signup", signupGet);
router.post("/signup", signupPost);
router.get("/otp", otpGet);
router.post("/otp", otpPost);
router.get("/login", loginGet);
router.get("/userForgotPassword", forGet);
router.post("/userLoginEmailVerify", forgPost);
router.get("/forgotOtp",forgetOtpverifiGet)
router.post('/userLoginOtpVerify',forgototpPOst);
router.get('/resetPassword',ResetPassGet);
router.post("/userLoginResetPass",resetpassPost);
router.post('/userLogin',loginPost)


module.exports = router;
