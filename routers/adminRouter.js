const express = require("express");
const router = express.Router();

const{adminSignUpGet,adminsignupPost,adminLoginGet,adminLoginPost}=require('../controllers/adminController')


router.get('/signup',adminSignUpGet)
router.post("/signup",adminsignupPost)
router.get('/login',adminLoginGet)
router.post("/login",adminLoginPost)
module.exports=router

