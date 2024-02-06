const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../middleware/multer");

const {
  adminSignUpGet,
  adminsignupPost,
  adminLoginGet,
  adminLoginPost,
  addproductGet,
  addproductPost,
  AdminHomeGet,
  UsersListGet,
  deleteUser,
  productsGet,
  productDelete,
  addCatagory,
  addCatagoryPost,
  couponGet,
  couponPost,
  couponlistGet
} = require("../controllers/adminController");



 

const upload = multer({ storage });


router.get("/signup", adminSignUpGet);
router.post("/signup", adminsignupPost);
router.get("/login", adminLoginGet);
router.post("/login", adminLoginPost);
router.get("/home", AdminHomeGet);
router.get("/addproducts", addproductGet);
router.post("/addproducts", upload.array("productImage", 20), addproductPost);
router.get('/userslist',UsersListGet)
router.get("/delete/:id",deleteUser)
router.get('/productslist',productsGet)
router.get('/deleteproduct/:id',productDelete)
router.get('/addcatagory',addCatagory)
router.post('/addcatagory',upload.single('categoryImage'),addCatagoryPost)
router.get('/couponslist',couponlistGet)
router.get('/addcoupon',couponGet);
router.post('/addcoupon',couponPost);
module.exports = router;
