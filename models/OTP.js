const mongoose = require("mongoose");
const {mail} = require("../utils/sendMail");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 3*60,
    }
});



otpSchema.pre("save",async function(next){
    try{
        
        const otp = this;
        console.log(otp);
        const response = await mail(otp.email,"Verification mail from NewsAtBlink",otp.otp);
        console.log("email sent successfully",response);
    }catch(error){
        console.error("there is an error while sending the mail" ,error.message);
    }
    next();
});

module.exports = mongoose.model("Otp",otpSchema);