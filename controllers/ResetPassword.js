const User = require("../models/User");
const crypto = require("crypto");
const {mail} = require("../utils/sendMail");
const bcrypt = require("bcryptjs");

exports.resetPasswordToken = async(req,res)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(500).json({
                success:false,
                message:"The user is not registered with us",
            })
        }
        const parameter = crypto.randomUUID();
        //update the user with the resetPasswordToken and expire time 
        console.log(parameter);
        const updateUser = await User.findOneAndUpdate({email:email},{
            resetPasswordToken:parameter,
            expireResetPasswordToken:Date.now()+5*60*1000,
        },{new:true});
        console.log(updateUser);
        const recoverUrl = `http://localhost:3000/update-password/${parameter}`;
        const recoverMail = await mail(email,"Recover mail for password from Team NewsAtBlink",
                                    `<p>Click the link to update the password</p><a href=${recoverUrl}>Click Here</a>`);
        console.log(recoverMail);                            
        return res.status(300).json({
            success:true,
            message:"An recover email is sent to you email ID",
            updateUser,
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Can't generate Recover mail and token",
        })
    }
}

exports.resetPassword = async(req,res)=>{
    try{
        const {token,password,confirmPassword} = req.body;
        //validation
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password and confirmPassword are not matching",
            })
        }
        console.log(token,password);
        const user = await User.findOne({resetPasswordToken:token});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"token is invalid",
            })
        }
        if(Date.now() > user.expireResetPasswordToken){
            return res.status(400).json({
                success:false,
                message:"token is expired",
            })
        }
        //hash the password
        const hashedPassword =await bcrypt.hash(password,10);
        //update data in user
        console.log(hashedPassword);
        const updatedUser = await User.findOneAndUpdate({resetPasswordToken:token},
            {
                password:hashedPassword,
            },{new:true});
            console.log(updatedUser);
        return res.status(200).json({
            success:true,
            message:"Password Updated successfully",
        })    
    }catch(err){
        return res.status(500).json({
            success:false,
            message:`Can't reset the password, ${err.message}`,
        }) 
    }
}