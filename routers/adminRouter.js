const express = require("express");
const router = express.Router();
const multer = require('multer')
const storage=require('../middleware/multer')

const {
  adminSignUpGet,
  adminsignupPost,
  adminLoginGet,
  adminLoginPost,
  addproductGet,
  addproductPost
} = require("../controllers/adminController");

const upload = multer({ storage })  

router.get("/signup", adminSignUpGet);
router.post("/signup", adminsignupPost);
router.get("/login", adminLoginGet);
router.post("/login", adminLoginPost);
router.get("/addproducts", addproductGet);
router.post('/addproducts',upload.array('productImage',20),addproductPost);


module.exports = router;
