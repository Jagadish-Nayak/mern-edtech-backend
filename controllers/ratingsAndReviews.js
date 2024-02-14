const { default: mongoose } = require("mongoose");
const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const Category = require("../models/Category");


exports.createRating = async (req,res) =>{
    try{
        const {rating,review,courseId} = req.body;
        const user = req.user.id;
        if(!courseId || !rating || !review){
            return res.status(400).json({
                success:false,
                message:`course id can't be fetched`,
            })
        }
        const uid = new mongoose.Schema.Types.ObjectId(user); 
        const relatedCourse = await Course.findById({courseId});
        if(!relatedCourse.studentEnrolled.includes(uid)){
            return res.status(400).json({
                success:false,
                message:`User is not enrolled in the course`,
            })
        }
        const alreadyRated = await RatingAndReview.findOne({user:uid,course:courseId});
        if(alreadyRated){
            return res.status(400).json({
                success:false,
                message:`User has already reviwed in the course`,
            })
        }
        const ratingandreview = await RatingAndReview.create({
            user:user,course:courseId,rating,review
        });
        await Course.findByIdAndUpdate({courseId},{$push:{ratingAndReviews:ratingandreview}},{new:true});
        return res.status(200).json({
            success:true,
            message:`review created successfully`,
            data:ratingandreview,
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`can't create rating, ${err.message}`
        })
    }
}

exports.getAverageRating = async(req,res) =>{
    try{
        const {courseId} = req.body;
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:`can't find courseId in request`
            })
        }
        const avgRating = await RatingAndReview.aggregate([
            {$match:{course:new mongoose.Schema.Types.ObjectId(courseId)}},
            {$group:{_id:null,averageRating:{$avg:"$rating"}}},
        ])
        if(avgRating.length>0){
            return res.status(200).json({
                success:true,
                message:`Average rating fetched successfully`,
                data:avgRating[0].averageRating,
            })
        }else{
            return res.status(200).json({
                success:true,
                message:`No one has rated this course till now`,
                data:0,
            })
        }
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`can't get average rating, ${err.message}`
        })
    }
}

exports.allRating = async(req,res) =>{
    try{
        const allRatings = await RatingAndReview.find({}).sort({rating:-1}).populate({path:"user",select:"firstName lastName email imageUrl"})
                                                                            .populate({path:"course",select:"title"}).exec();
        return res.status(200).json({
            success:true,
            message:"All ratings fetched successfully",
            data:allRatings,
        })

    }catch(err){
        return res.status(400).json({
            success:false,
            message:`can't get ratings, ${err.message}`
        })
    }
}

