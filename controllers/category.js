const Category = require("../models/Category");


exports.createCategory = async(req,res)=>{
    try{
        const {name,desc} = req.body;
        if(!name || !desc){
            return res.status(402).json({
                success:false,
                message:"all fields are required",
            });
        }
        await Category.create({
            name:name,
            description:desc,
        });
        return res.status(302).json({
            success:true,
            message:"category added successfully",
        });
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`Can't create category, ${err.message}`,
        });
    }
}

exports.showAllCategories = async(req,res)=>{
    try{
        const allCategories = await Category.find({},{name:true,description:true});
        return res.status(202).json({
            success:true,
            message:"all categories are fetched successfully",
            data:allCategories,
        });
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`Can't fecth all categories list, ${err.message}`,
        });
    }
}

exports.getCategoryDetails = async(req,res) =>{
    try{
        const {categoryId} = req.body;
        if(!categoryId){
            return res.status(400).json({
                success:false,
                message:`Can't get category in request`,
            })
        }
        const categoryDetails = await Category.findById({_id:categoryId}).populate("courses").exec();
        if(!categoryDetails.courses.length>0){
            return res.status(400).json({
                success:false,
                message:`No data found related to this category`,
            })
        }
        const otherCategories = await Category.find({_id:{$ne:categoryId}}).populate("courses").exec();
        return res.status(200).json({
            success:true,
            message:`fetched category wise courses`,
            data:{
                categoryDetails,
                otherCategories,
            }
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`Can't get categorydetails, ${err.message}`,
        })
    }
}