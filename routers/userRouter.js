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
  userHomeGet,
  shopbycategoryGet,
  logout,
} = require("../controllers/userController");

router.get("/signup", signupGet);
router.post("/signup", signupPost);
router.get("/otp", otpGet);
router.post("/otp", otpPost);
router.get("/login", loginGet);
router.get("/userForgotPassword", forGet);
router.post("/userLoginEmailVerify", forgPost);
router.get("/forgotOtp", forgetOtpverifiGet);
router.post("/userLoginOtpVerify", forgototpPOst);
router.get("/resetPassword", ResetPassGet);
router.post("/userLoginResetPass", resetpassPost);
router.post("/userLogin", loginPost).get("/logout", logout);

const { userSingleproduct } = require("../controllers/productController");

router
  .get("/home", userHomeGet)
  .get("/user/viewsingleproduct", userSingleproduct)
  .get("/allproducts", shopbycategoryGet);

const {
  wishlist,
  removewishlist,
  showwishlist,
  wishlistGet,
} = require("../controllers/wishlistController");

router
  .post("/addwishlist", wishlist)
  .post("/removewishlist", removewishlist)
  .post("/showwishlist", showwishlist)
  .get("/wishlist", wishlistGet);

const {
  cartlist,
  addTocart,
  showaddtocart,
  deleteCart,
  cartQtyUpdate
} = require("../controllers/cartController");

router
  .get("/cart", cartlist)
  .post("/addtocart", addTocart)
  .post("/showaddtocart", showaddtocart)
  .post("/deletecart", deleteCart)
  .post('/cartquantity',cartQtyUpdate)
module.exports = router;
