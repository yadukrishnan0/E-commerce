const productModel = require("../models/adminSchema/productSchema");
const profileModel = require("../models/userSchema/profie");
const cartModel = require("../models/userSchema/cartSchema");
const couponModel = require("../models/adminSchema/couponSchema");
const orderModel = require("../models/userSchema/orderSchema");
const signupModel = require("../models/userSchema/userSIgnupSchema");

module.exports = {
  chart: async (req, res) => {
    try {
      const status = "Delivered";

      const monthlyTotals = await orderModel.aggregate([
        {
          $match: { Status: status },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            total: { $sum: "$totalprice" },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            year: "$_id.year",
            total: 1,
          },
        },
        {
          $sort: { year: 1, month: 1 },
        },
      ]);
      
 const users = await signupModel.find({});
      res.status(200).json({ success: true, data: monthlyTotals,users });
    } catch (err) {
      console.log("chart js error", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
