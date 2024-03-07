const mongoose = require("mongoose");

const signupSchema = mongoose.Schema({
  fullName: {
    type: String
   
  },
  phoneNumber: {
    type: String
    
  },
  email: {
    type: String
    
  },
  password: {
    type: String
    
  },
  role:{
    default:false,
    type:Boolean
  },
  block:{
    default:true,
    type:Boolean
  }
},{timestamps:true});

const usersignupModel = mongoose.model("usersignups", signupSchema);
module.exports = usersignupModel;
