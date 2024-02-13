const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../utilities/multer");

const {
  adminSignUpGet,
  adminsignupPost,
  adminLoginGet,
  adminLoginPost,
  AdminHomeGet,
  UsersListGet,
  deleteUser,
} = require("../controllers/adminController");

const {
  addproductPost,
  addproductGet,
  productsGet,
  productDelete,
} = require("../controllers/productController");

// coupon
const {
  couponGet,
  couponPost,
  couponlistGet,
  DeleteCoupon,
  editCouponGet,
  updateCoupon,
} = require("../controllers/couponController");

// category
const {
  addCatagory,
  addCatagoryPost,
  categoryList,
  deletecategory,
} = require("../controllers/categoryController");

// banner

const { bannerGet, AddbannerGet,AddbannerPost} = require("../controllers/bannerController");

const upload = multer({ storage });

router.get("/signup", adminSignUpGet);
router.post("/signup", adminsignupPost);
router.get("/login", adminLoginGet);
router.post("/login", adminLoginPost);
router.get("/home", AdminHomeGet);
router.get("/addproducts", addproductGet);
router.post("/addproducts", upload.array("productImage", 20), addproductPost);
router.get("/userslist", UsersListGet);
router.get("/delete/:id", deleteUser);
router.get("/productslist", productsGet);
router.get("/deleteproduct/:id", productDelete);
router.get("/addcatagory", addCatagory);
router.post("/addcatagory", upload.single("categoryImage"), addCatagoryPost);
router.get("/couponslist", couponlistGet);
router.get("/addcoupon", couponGet);
router.post("/addcoupon", couponPost);
router
  .get("/deleteCoupon/:id", DeleteCoupon)
  .get("/editcoupon/:id", editCouponGet)
  .get("/categorylist", categoryList) 
  .post("/updatecoupon/:id", updateCoupon)
  .delete("/deletecategory", deletecategory);

router.get("/bannerlist", bannerGet)
router.get("/addbanner", AddbannerGet);
router.post('/addbanner',upload.single('BannerImage'),AddbannerPost)
module.exports = router;
