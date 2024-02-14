const User = require("../models/User");
const Profile = require("../models/Profile");
const {uploadFile} = require("../utils/uploadFile");
require("dotenv").config();

exports.updateProfile = async(req,res) =>{
    try{
        const {firstName,lastName,gender='',dob='',about,contact} = req.body;
        if(!about || !contact){
            return res.status(402).json({
                success:false,
                message:`All fields are required`,
            }); 
        }
        const user = req.user.id;
        if(!user){
            return res.status(402).json({
                success:false,
                message:`User is not found`,
            }); 
        }
        const userDetails = await User.findById({_id:user});
        if(firstName !== userDetails.firstName || lastName !== userDetails.lastName){
             await User.findByIdAndUpdate({_id:user},{firstName:firstName,lastName:lastName},{new:true});
        }
        const profileId = userDetails.additionalDetails;
        console.log(profileId);
        const updatedProfileDetails = await Profile.findByIdAndUpdate({_id:profileId},{
            gender,dob,about,contact
        },{new:true});
        const updatedUser = await User.findById({_id:user}).populate('additionalDetails').exec();
        console.log(updatedUser);
        return res.status(200).json({
            success:true,
            message:"profile created successfully",
            data:updatedUser,
        });
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`can't update your profile, ${err.message}`,
        });
    }
}

exports.deleteAccount = async(req,res)=>{
    try{
        const id = req.user.id;
        if(!id){
            return res.status(400).json({
                success:false,
                message:`can't find userId in request`,
            });
        }
        const userDetails = await User.findById({_id:id});
        const profileDetails = await userDetails.additionalDetails;
        await Profile.findByIdAndDelete({_id:profileDetails});
        await User.findByIdAndDelete({_id:id});
        return res.status(200).json({
            success:true,
            message:`Profile deleted successfully`,
        });
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`can't delete your profile, ${err.message}`,
        });
    }
}

exports.getAllUserDetails = async(req,res)=>{
    try{
        const id = req.user.id;
        const userDetails = await User.findById({_id:id}).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            message:`User details fetched successfully`,
            data:userDetails,
        });
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`can't find user profile, ${err.message}`,
        });
    }
}

exports.updateProfilePicture = async(req,res)=>{
    try{
        const file = req.files.file;
        console.log('response of image ',file)
        const user = req.user.id;
        const uploadedImage = await uploadFile(file,process.env.FOLDER_NAME);
        console.log(uploadedImage);
        const updatedUser = await User.findByIdAndUpdate({_id:user},{imageUrl:uploadedImage.secure_url},{new:true});
        return res.status(200).json({
            success:true,
            message:"Profile image updated successfully",
            data:updatedUser,
        }) 
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`can't update user profile image, ${err.message}`,
        });
    }
}

exports.getEnrolledCourses = async(req,res)=>{
    try{
        const user = req.user.id;
        const allEnrolledCourses = await User.findById({user}).populate("enrolledCourses").exec();
        if (!user) {
            return res.status(400).json({
              success: false,
              message: `Could not find user with id: ${user}`,
            })
          }
          return res.status(200).json({
            success: true,
            data: allEnrolledCourses.enrolledCourses,
          })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: `Could not get the enrolled courses: ${err.message}`,
          });
    }
}