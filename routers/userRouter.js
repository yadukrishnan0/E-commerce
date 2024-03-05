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
  userAcctGet,
  userAccUpdate,
  addAddressGet,
  editaddresslist,
  addAddressPost,
  deleteaddress,
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
router
  .post("/userLogin", loginPost)
  .get("/logout", logout)
  .get("/userAccont", userAcctGet)
  .get("/userUpdateAccount", userAccUpdate)
  .get("/userEditAddress", editaddresslist)
  .get("/addAddress", addAddressGet)
  .post("/userUpdateAccount", addAddressPost)
  .post("/deleteaddress", deleteaddress);

const {
  userSingleproduct,
  searchProduct,
  MinMaxfilter,
} = require("../controllers/productController");

router
  .get("/home", userHomeGet)
  .get("/user/viewsingleproduct", userSingleproduct)
  .get("/allproducts", shopbycategoryGet)
  .get("/search", searchProduct)
  .post("/userFliterByPrice", MinMaxfilter);

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
  cartQtyUpdate,
} = require("../controllers/cartController");

router
  .get("/cart", cartlist)
  .post("/addtocart", addTocart)
  .post("/showaddtocart", showaddtocart)
  .post("/deletecart", deleteCart)
  .post("/cartquantity", cartQtyUpdate);

const {
  checkOutGet,
  applyCoupon,
  chechkOutPost,
  orderConfirmOtp,
  orderConfirmOtpPost,
  confirmSuccess,
  userBuyNow,
  orderpageGet,
  razorpayPost
} = require("../controllers/paymentController");
const Razorpay = require("razorpay");
router
  .get("/checkout", checkOutGet)
  .post("/userApplyCoupon", applyCoupon)
  .post("/chechkoutPayment", chechkOutPost)
  .get("/oderConfirm", orderConfirmOtp)
  .post("/oderConfirm", orderConfirmOtpPost)
  .get('/confirm',confirmSuccess)
  .get('/userBuyNow',userBuyNow)
  .get('/userOrders',orderpageGet)
  .post('/razorpayment',razorpayPost)
module.exports = router;
