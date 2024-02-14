

const nodemailer = require("nodemailer");

const emailverification=(email,otp)=>{
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOption = {
    from: {
      name: "Verification",
      address: "textacc3690@gmail.com",
    },
    to: email,
    subject: "OTP",
    text: `Your OTP is ${otp}`,
  };

  const sendMail = async (transporter, mailOption) => {
    try {
      await transporter.sendMail(mailOption);
      console.log("Mail has been sent successfully");
    } catch (error) {
      console.log(Error`occurred while sending email: ${error}`);
    }
  };
  sendMail(transporter, mailOption)
}

module.exports =emailverification;