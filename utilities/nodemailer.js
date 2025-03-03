const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure environment variables are loaded

const emailVerification = async (email, otp) => {
  console.log("Sending OTP to:", email);

  // Transporter Configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD, // Use App Password, NOT Gmail password
    },
  });

  const mailOptions = {
    from: {
      name: "Verification",
      address: process.env.USER, // Use the email from env
    },
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return { success: true, message: "Email sent" };
  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    return { success: false, message: error.message };
  }
};

module.exports = emailVerification;
