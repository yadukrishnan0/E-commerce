function generateSixDigitNumber() {
  return Math.floor(Math.random() * 900000) + 100000;
}
const otp = generateSixDigitNumber();

module.exports = otp;
