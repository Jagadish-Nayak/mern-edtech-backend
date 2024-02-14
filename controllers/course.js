const Category = require("../models/Category");
const User = require("../models/User");
const {uploadFile} = require("../utils/uploadFile");
require("dotenv").config();
const Course = require("../models/Course");

exports.createCourse = async(req,res)=>{
    try{
        const {title,desc,price,category,whatyoulearn,status} = req.body;
        const file = req.files.file;
        if(!title || !desc || !category || !price || !file || !whatyoulearn){
            return res.status(402).json({
                success:false,
                message:`all fields are required`,
            });
        }
        if (!status || status === undefined) {
			status = "Draft";
		}
        const invalidCategoryCheck = await Category.findById({id:category});
        if(!invalidCategoryCheck){
            return res.status(402).json({
                success:false,
                message:`Category is invalid`,
            });
        }
        const educator = req.user.id;
        const uploaderImage = uploadFile(file,process.env.FOLDER_NAME);
        const course = await Course.create({
            title,description:desc,instructor:educator,whatyoulearn,price,
            thumbnail:uploaderImage.secure_url,Category:category,tags,status
        });
        const updateEducator = await User.findByIdAndUpdate({_id:educator},{$push:{enrolledCourses:course._id}},{new:true});
        console.log(updateEducator);
        await Category.findByIdAndUpdate({_id:category},{$push:{courses:course._id}},{new:true});
        return res.status(200).json({
            success:true,
            message:`course Created successfuly`,
            data:course,
        });
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`Can't create the course, ${err.message}`,
        });
    }
}

exports.showAllCourses = async (req,res) =>{
    try{
        const allCourses = await Course({},{title:true,
                                            description:true,
                                            instructor:true,
                                            whatyoulearn:true,
                                            price:true,
                                            thumbnail:true,}).populate("instructor").exec();
        return res.status(200).json({
            success:true,
            message:`All courses are fetched successfully`,
            data:allCourses,
        });                                                                       
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`can't fetch all course details, ${err.message}`,
        });
    }
}

exports.showCourseDetails = async(req,res)=>{
    try{
        const {courseId} = req.body;
        const courseDetails = await Course.findById({courseId}).
                                            populate({
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails"
                                                }
                                            }).populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection"
                                                }
                                            }).populate("studentEnrolled")
                                            .populate("ratingAndReviews")
                                            .populate("category").exec();
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"can't find the course",
            })
        }
        return res.status(200).json({
            success:true,
            message:"The course details fetched successfully",
            data:courseDetails,
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`Can't fetch the course details, ${err.message}`,
        })
    }
}

