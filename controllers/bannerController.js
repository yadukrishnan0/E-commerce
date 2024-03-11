const {
  ConversationPage,
} = require("twilio/lib/rest/conversations/v1/conversation");
const bannerModel = require("../models/adminSchema/bannerSchema");
const fs = require("fs");
module.exports = {
  bannerGet: async (req, res) => {
    try {
      if (req.session.admin) {
        const data = await bannerModel.find({});
        res.render("admin/bannerList", { data });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("banner get err", err);
    }
  },
  AddbannerGet: (req, res) => {
    try {
      if (req.session.admin) {
        res.render("admin/addBanner");
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("add banner get :", err);
    }
  },
  AddbannerPost: async (req, res) => {
    try {
      if (req.session.admin) {
        const { Title, Discription, Expiry } = req.body;
        const BannerImage = req.file.filename;
        const newdata = new bannerModel({
          Title,
          Discription,
          Expiry,
          BannerImage,
        });
        await newdata.save();
        res.status(200).json({ success: true, message: "banner added" });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("error addbanner", err);
    }
  },
  DeleteBanner: async (req, res) => {
    try {
      const id = req.query.id;
      const banner = await bannerModel.findOne({ _id: id });
      const imagePath = "./public/" + "Productimag/" + banner.BannerImage;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      await bannerModel.deleteOne({ _id: id });
      res.status(200).json({ success: true, message: "successfully deleted" });
    } catch (err) {
      console.log("delete banner error", err);
    }
  },
  updateBannerGET: async (req, res) => {
    try {
      if (req.session.admin) {
        const id = req.query.id;
        const data = await bannerModel.findOne({ _id: id });
        res.render("admin/editBanner", { data });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log("update banner get", err);
    }
  },
  updateBannerPost: async (req, res) => {
    try {
      const _id = req.query.id;
      const { Title, Discription, Expiry } = req.body;
      const BannerImage = req.file.filename;
      await bannerModel.updateOne(
        { _id },
        {
          $set: {
            Title: Title,
            Discription: Discription,
            Expiry: Expiry,
            BannerImage: BannerImage,
          },
        }
      );
      res
        .status(200)
        .json({ success: true, message: "banner update successfully" });
    } catch (err) {
      console.log("update banner post error", err);
      res.status(500).json({ success: true, message: "internal server error" });
    }
  },
};
