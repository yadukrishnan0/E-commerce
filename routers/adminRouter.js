const express = require("express");
const router = express.Router();
const{adminSignUpGet}=require('../controllers/adminController')
router.get('/signup',adminSignUpGet)
module.exports=router