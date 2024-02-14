const {mail} = require("../utils/sendMail");

exports.contactUs = async(req,res)=>{
    try{
        const {firstName,lastName,email,phone,message} = req.body;
        const sentmail = mail(email,"Regarding the Help","Your form regarding the help has been sent to us! Thank You");
        return res.status(200).json({
            success:true,
            message:"Mail sent successfully",
            sentmail,
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Can't contact to the company",
        })
    }
}