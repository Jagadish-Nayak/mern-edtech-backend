const bcrypt = require("bcryptjs");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const Otp = require("../models/OTP");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Profile = require("../models/Profile");

exports.sendOtp = async(req,res)=>{
    try{
        const {email} = req.body;
        console.log(email);
        if(!email){
            return res.status(401).json({
				success: false,
				message: `Could not get the email id`,
			});
        }
        const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}
        let otp = otpGenerator.generate(6,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false,
        });
        if(otp.length===0){
            return res.status(400).json({
                success:false,
                message:"Otp could not generated",
            })
        }
        let matchingOtp = await Otp.findOne({otp});
        while(matchingOtp){
            otp = otpGenerator.generate(6,{
                lowerCaseAlphabets:false,
                upperCaseAlphabets:false,
                specialChars:false,
            });
            matchingOtp = await Otp.findOne({otp});
        }
        const newOtp = await Otp.create({
            email:email,otp:otp,
        })
        return res.status(200).json({
            success:true,
            message:"otp sent successfully",
            newOtp,
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:`Can't sent otp ,${err.message}`,
        });
    }
}

exports.signup = async(req,res) => {
    try{
        console.log(req.body);
        const {firstName,lastName,password,confirmPassword,email,accountType,contact,otp} = req.body;
        //validation
        if(!firstName || !lastName || !password || !confirmPassword || !email || !accountType ||!otp){
            return res.status(400).json({
                success:false,
                message:"All fields are mendetory",
            })
        }
        //check whether user exist or not
        const existingUser = await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registered with us",
            })
        }
        //password matches with confirmpassword
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password is not matching with confirm password",
            })
        }
        console.log(otp);
        //otp validation
        const recentOtp = await Otp.find({email:email}).sort({createdAt:-1}).limit(1);
        if(!recentOtp){
            return res.status(400).json({
                success:false,
                message:"Otp not found for the given email",
            })
        }
        console.log(recentOtp[0].otp);
        const givenOtp = otp.toString();
        console.log(givenOtp);
        if(givenOtp != recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"otp is incorrect",
            })
        } 

        const additionalDetails = await Profile.create({
            gender:null,
            dob:null,
            about:null,
            contact:contact,
        })
        let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);
        //hashhing the password
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({
            firstName,lastName,email,password:hashedPassword,contact,accountType,additionalDetails,approved,
            imageUrl:`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}%20${lastName}`,
        });
        return res.status(200).json({
            success:true,
            message:"User account created successfully",
            data:newUser,
        }) 
    }catch(err){
        return res.status(500).json({
            success:false,
            message:`Can't created user account ${err.message}`,
        });
    }
}

exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        let user = await User.findOne({email:email}).populate("additionalDetails");
        //validation
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User is not registered with us",
            });
        }
        
            if(!await bcrypt.compare(password,user.password)){
                return res.status(400).json({
                    success:false,
                    message:"password is incorrect",
                });
            }else{
                const payload={
                    email:user.email,
                    accountType:user.accountType,
                    id:user._id,
                }
                const options= {
                    expiresIn:2*60*60,
                }
                const token = jwt.sign(payload,process.env.JWT_SECRET,options);
                user = user.toObject();
                user.token = token;
                user.password = undefined;
                const option = {
                    expires:new Date(Date.now()+2*24*60*60*1000),
                    httpOnly:true,
                }
                res.cookie("token",token,option).status(200).json({
                    success:true,
                    message:"User account logged in successfully",
                    token,
                    user
                })
            }
        
    
    }catch(err){
        return res.status(500).json({
            success:false,
            message:`Can't login User,Please try again later,  ${err.message}`,
        }); 
    }
}

exports.changePassword = async(req,res) =>{
    try{
        const user = req.user.id;
        const {oldPassword,newPassword,confirmNewPassword} = req.body;
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }
        if(oldPassword === newPassword){
            return res.status(400).json({
                success:false,
                message:"old password should not match with new password",
            })
        }
        if(confirmNewPassword === newPassword){
            return res.status(400).json({
                success:false,
                message:"new password does not match with confirm new password",
            })
        }
        const userDetails = await User.findById({user});
        const oldPasswordMatch =  await bcrypt.compare(oldPassword,userDetails.password);
        if(!oldPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Old password does not match with given password"
            })
        }
        const bcryptedPassword = bcrypt.hash(newPassword,10);
        const updatedUser = await User.findByIdAndUpdate({user},{password:bcryptedPassword},{new:true});
        return res.status(200).json({
            success:true,
            message:"Password updated Successfully",
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Can't change the password",
        })
    }
}