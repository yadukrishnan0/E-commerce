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
  }
});

const usersignupModel = mongoose.model("userSignups", signupSchema);
module.exports = usersignupModel;
