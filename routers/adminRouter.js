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
  userblock,
  blocksers,
  unblockUser
} = require("../controllers/adminController");

const {
  addproductPost,
  addproductGet,
  productsGet,
  productDelete,
  updateProductGet,
  updateProductPost,
  viewsingleProductGet,
  adminSideOrderGet,
  updateStatus
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
  editcategory,
  deletesubcategry,
  updateCategory,
} = require("../controllers/categoryController");

// banner

const {
  bannerGet,
  AddbannerGet,
  AddbannerPost,
  DeleteBanner,
  updateBannerGET,
  updateBannerPost,
} = require("../controllers/bannerController");

const{chart}=require('../controllers/chartController');

router.post('/chart',chart);

const upload = multer({ storage });

router.get("/signup", adminSignUpGet);
router.post("/signup", adminsignupPost);
router.get("/login", adminLoginGet);
router.post("/login", adminLoginPost);
router.get("/home", AdminHomeGet);
router.get("/addproducts", addproductGet);
router.post("/addproducts", upload.array("productImage", 20), addproductPost);
router.get("/userslist", UsersListGet)
      .delete('/blockuser',userblock)
      .get('/blockeduser',blocksers)
      .delete('/unblockuser',unblockUser)

router.get("/productslist", productsGet);
router
  .delete("/deleteproduct", productDelete)
  .get("/updateProduct", updateProductGet)
  .post("/updateProduct", upload.array("productImage", 20), updateProductPost)
  .get("/viewsingleProduct", viewsingleProductGet);

router
  .get("/addcatagory", addCatagory)
  .post("/addcatagory", upload.single("categoryImage"), addCatagoryPost)
  .get("/categorylist", categoryList)
  .delete("/deletecategory", deletecategory)
  .get("/editcategory", editcategory)
  .delete("/deletesubcategory", deletesubcategry)
  .post("/updatecatagory", upload.single("categoryImage"),updateCategory);

router
  .get("/couponslist", couponlistGet)
  .get("/addcoupon", couponGet)
  .post("/addcoupon", couponPost)
  .get("/deleteCoupon/:id", DeleteCoupon)
  .get("/editcoupon/:id", editCouponGet)
  .post("/updatecoupon/:id", updateCoupon);

router
  .get("/bannerlist", bannerGet)
  .get("/addbanner", AddbannerGet)
  .post("/addbanner", upload.single("BannerImage"), AddbannerPost)
  .delete("/deletebanner", DeleteBanner)
  .get("/updateBanner", updateBannerGET)
  .post("/updateBanner", upload.single("BannerImage"), updateBannerPost)
  .get('/order',adminSideOrderGet)
  .post('/updatestatus',updateStatus)
module.exports = router;
