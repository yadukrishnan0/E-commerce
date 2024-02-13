const mongoose =require('mongoose');
const connectDB= async () =>{
    try{
        const con =await mongoose.connect(process.env.URL);
        console.log(`mongoDb connected:${con.connection.host}`);
    }catch(err){
        console.log(err)
    }
}

module.exports= connectDB