// const nodemailer = require("nodemailer");

// const otpGenerator = require("otp-generator");

// const otpGenerate = () => {
//   const OTP = otpGenerator.generate(6, {
//     upperCaseAlphabets: false,
//     specialChars: false,
//   });
//   return OTP;
// };



function generateSixDigitNumber() {
  return Math.floor(Math.random() * 900000) + 100000;
}
const otp = generateSixDigitNumber();;

module.exports = otp;


 
