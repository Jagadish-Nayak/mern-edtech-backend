const Section = require("../models/Subsection");
const Course = require("../models/Course");

exports.createSection = async (req,res) =>{
    try{
        const {name,courseId} = req.body;
        if(!name || !courseId){
            return res.status(402).json({
                success:false,
                message:`all fields are required`,
            });
        }
        const section = await Section.create({sectionName:name});
        const updatedCourse = await Course.findByIdAndUpdate({courseId},{$push:{courseContent:section._id}},{new:true})
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection"
                                                }
                                            }).exec();
        return res.status(200).json({
            success:true,
            message:`Entry created successfully`,
            updatedCourse,
            section
        });
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`can't create the section, ${err.message}`,
        });
    }
}

exports.updateSection = async (req,res) =>{
    try{
        const {name,sectionId} = req.body;
        const updatedSection = await Section.findByIdAndUpdate({sectionId},{sectionName:name},{new:true});
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            data:updatedSection,
        });
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`Can't update section name, ${err.message}`,
        });
    }
};

exports.deleteSection = async (req,res) =>{
    try{
        const {sectionId} = req.params;
        if(!sectionId){
            return res.status(402).json({
                success:false,
                message:`No such section id is found`,
            });
        }
        await Section.findByIDAndDelete({sectionId});
        return res.status(200).json({
            success:true,
            message:`Section deleted successfully`,
        }); 
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`Can't delete the section, ${err.message}`,
        });
    }
}