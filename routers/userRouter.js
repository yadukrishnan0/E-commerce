const express=require("express");
const router=express.Router()

const{signupGet,signupPost}=require("../controllers/userController");

router.get("/signup",signupGet)
router.post("/signup",signupPost)

module.exports=router