const { Redirect } = require("twilio/lib/twiml/VoiceResponse");
const productModel = require("../models/adminSchema/productSchema");
const profileModel = require("../models/userSchema/profie");
const cartModel = require("../models/userSchema/cartSchema");
const couponModel = require("../models/adminSchema/couponSchema");
const orderModel = require("../models/userSchema/orderSchema");
const emailverification = require("../utilities/nodemailer");
const signupModel = require("../models/userSchema/userSIgnupSchema");
const otpC = Math.floor(Math.random() * 900000) + 100000;
module.exports = {
  checkOutGet: async (req, res) => {
    try {
      let totalAmt;
      const _id = req.session.user;
      if (_id) {
        const cart = await cartModel
          .findOne({ userId: _id })
          .populate("products.productId");
        const useraddress = await profileModel.findOne({ userId: _id });
        if (req.session.sprice) {
          totalAmt = req.session.sprice;
          delete req.session.sprice;
        } else {
          totalAmt = cart.products.reduce((accu, data) => {
            const result =
              (data.productId.price * data.productId.discount) / 100;
            const discountedPrice = Math.ceil(data.productId.price - result);
            return (accu += discountedPrice * data.quantity);
          }, 0);
        }
        res.render("user/checkout", { useraddress, totalAmt });
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log("check out get err", err);
    }
  },
  applyCoupon: async (req, res) => {
    try {
      const couponCode = req.body.couponCode;

      if (req.session.user) {
        const _id = req.session.user;
        const coupon = await couponModel.findOne({
          couponCode,
        });

        if (coupon) {
          const cart = await cartModel
            .findOne({ userId: _id })
            .populate("products.productId");

          const totalAmt = cart.products.reduce((accu, data) => {
            const result =
              (data.productId.price * data.productId.discount) / 100;
            const discountedPrice = Math.ceil(data.productId.price - result);
            return (accu += discountedPrice * data.quantity);
          }, 0);
          const coupondiscount = coupon.upTo;
          const discountedPrice = Math.ceil(
            totalAmt - totalAmt * (coupon.upTo / 100)
          );
          res
            .status(200)
            .json({ success: true, discountedPrice, coupondiscount });
        } else {
        }
      } else {
        res.status(401).json("please login");
      }
    } catch (err) {
      console.log("apply coupon err", err);
    }
  },
  chechkOutPost: async (req, res) => {
    try {
      const { payMethod, address, totalPrice } = req.body;
      const price = parseInt(totalPrice);
      const _id = req.session.user;
      const user = await signupModel.findOne({ _id });
      const email = user.email;
      if (payMethod == "COD") {
        req.session.payMethod = payMethod;
        req.session.address = address;
        req.session.totalPrice = totalPrice;
        emailverification(email, otpC);
        console.log(otpC);
        res.status(200).json({ success: true, COD: true });
      } else {
        console.log("not cod");
      }
    } catch (err) {
      console.log("chechk out post error", err);
    }
  },
  orderConfirmOtp: (req, res) => {
    try {
      if (req.session.user) {
        res.render("user/orderOtp");
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log("orderConfirmOtp", err);
    }
  },
  orderConfirmOtpPost: async (req, res) => {
    try {
      let cart=[]
      const _id = req.session.user;
      const { otp } = req.body;
    
      if (otp == otpC) {
        const payMethod = req.session.payMethod;
        const address = req.session.address;
        const totalPrice = req.session.totalPrice;
        console.log('hello');
        let carts = await cartModel.findOne({ userId: _id });
        console.log(cart);
        if (req.session.productId) {
          let products=[{
            productId: req.session.productId,
            quantity: 1,
          }]
          cart =products;
        } else {
          cart = carts.products;
        }
        const newdata = new orderModel({
          userId: _id,
          products:cart,
          totalprice: totalPrice,
          address: address,
          paymentMethod: payMethod,
          Status: "pending",
        });
        await newdata.save();
        await cartModel.deleteOne({ userId: _id });
       delete  req.session.sprice;
       delete  req.session.productId;
       res.redirect("/confirm");
      }
    } catch (err) {
      console.log("orderConfirmOtpPost error", err);
    }
  },
  confirmSuccess: (req, res) => {
    try {
      if (req.session.user) {
        res.render("user/confirm");
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log("confirmSuccess", err);
    }
  },
  userBuyNow: async (req, res) => {
    try {
      const _id = req.query.id;
      const product = await productModel.findOne({ _id });
      const result = (product.price * product.discount) / 100;
      const discountedPrice = Math.ceil(product.price - result);
      req.session.sprice = discountedPrice;
      req.session.productId = _id;
      res.redirect("/checkout");
    } catch (err) {
      console.log("userBuyNow errr", err);
    }
  },
};