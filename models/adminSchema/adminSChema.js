const mongoose = require("mongoose");

const signupSchema = mongoose.Schema({
  fullName: {
    type: String
   
  },
    
  email: {
    type: String
    
  },
  password: {
    type: String
    
    
  }
});

const adminsignupModel = mongoose.model("adminSignup", signupSchema);
module.exports =adminsignupModel ;
