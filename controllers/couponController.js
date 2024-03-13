const { Module } = require("module");
require("dotenv").config();

const couponModel = require("../models/adminSchema/couponSchema");

const moment = require("moment");

const { constants } = require("buffer");
const { render } = require("ejs");
const session = require("express-session");
require("dotenv").config();

const { json } = require("stream/consumers");

module.exports = {
  couponGet: (req, res) => {
    try {
      if (req.session.admin) {
        res.status(200).render("admin/addcoupon");
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("coupon get err", err);
    }
  },

  couponPost: async (req, res) => {
    try {
      const { couponCode, upTo, validFrom, validTo,price} = req.body;

      const validFromFormatted = moment(validFrom).format("MM-DD-YYYY");
      const validToFormatted = moment(validTo).format("MM-DD-YYYY");

      const newdata = new couponModel({
        couponCode: couponCode.toUpperCase(),
        upTo,
        validFrom: validFromFormatted,
        validTo: validToFormatted,
        price
      });
      await newdata.save();
      res.status(230).redirect("/admin/couponslist");
    } catch (err) {
      console.log("coupon post err", err);
      res.status(500).send("internal server error");
    }
  },

  couponlistGet: async (req, res) => {
    try {
      if (req.session.admin) {
        const data = await couponModel.find({});
        res.render("admin/couponList", { data });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      res.status(500).send("internal sever eroor");
    }
  },
  editCouponGet: async (req, res) => {
    try {
      if (req.session.admin) {
        const _id = req.params.id;
        const data = await couponModel.findOne({ _id });
        res.status(200).render("admin/editCoupon", { data });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("edit coupon error", err);
    }
  },
  updateCoupon: async (req, res) => {
    try {
      const { couponCode, upTo, validFrom, validTo,price} = req.body;
      const code = couponCode.toUpperCase();
      const _id = req.params.id;
      abc = await couponModel.updateOne(
        { _id },

        {
          $set: {
            couponCode: code,
            upTo: upTo,
            validFrom: validFrom,
            validTo: validTo,
            price
          },
        }
      );

      res.status(200).redirect("/admin/couponslist");
    } catch (err) {
      console.log("coupon update err", err);
    }
  },

  DeleteCoupon: async (req, res) => {
    try {
      const _id = req.params.id;

      await couponModel.deleteOne({});

      res.redirect("/admin/couponslist");
    } catch (err) {
      res.status(500).send("");
    }
  },
};
