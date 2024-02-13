const bannerModel =require('../models/adminSchema/bannerSchema');
module.exports={
    bannerGet:(req,res)=>{
        try{
          res.render('admin/bannerList')
        }
        catch(err){
            console.log('banner get err',err)
        }
    },
    AddbannerGet:(req,res)=>{
        try{
           res.render('admin/addBanner')
        }
        catch(err){
        console.log('add banner get :',err)
        }
    },
    AddbannerPost:async (req,res)=>{
        try{
            const{ Title,Discription,Expiry}=req.body
           const BannerImage=req.file.filename
            const newdata = new bannerModel({
                Title,
                Discription,
                Expiry,
                BannerImage
            })
            await newdata.save();
            res.status(200).json({success:true ,message:'banner added'})
        }
        catch(err){
            console.log('error addbanner',err)
        }
    }
}