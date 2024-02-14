const Section = require("../models/Section");
const Subsection = require("../models/Subsection");
const {uploadFile} = require("../utils/uploadFile");
require("dotenv").config();

exports.createSubsection = async(req,res)=>{
    try{
        const {title,timeDuration,description,sectionId} = req.body;
        const videoFile = req.files.videoFile;
        if(!title || !timeDuration || !description || !videoFile || !sectionId){
            return res.status(402).json({
                success:false,
                message:`All fields are required`,
            });
        }
        const uploadedVideo = uploadFile(videoFile,process.env.FOLDER_NAME);
        const subsection = await Subsection.create({title,timeDuration,description,
                                                    videoUrl:uploadedVideo.secure_url});
        const updatedSection = await Section.findByIdAndUpdate({sectionId},{$push:{subSection:subsection._id}},{new:true}).populate("subSection").exec();
        console.log(updatedSection);
        return res.status(300).json({
            success:true,
            message:`subsection created successfully`,
            data:updatedSection,
        });
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`can't create the subsection, ${err.message}`,
        });
    }
}

exports.updateSubsection = async(req,res) =>{
    try{
        const {title,timeDuration,description,subsectionId} = req.body;
        const videoFile = req.files.videoFile;
        if(!title || !timeDuration || !description || !videoFile || !subsectionId){
            return res.status(402).json({
                success:false,
                message:`All fields are required`,
            });
        }
        const uploadedVideo = uploadFile(videoFile,process.env.FOLDER_NAME);
        const updatedSubsection = await Subsection.findByIdAndUpdate({subsectionId},{
            title,timeDuration,description,
            videoUrl:uploadedVideo.secure_url
        },{new:true});
        return res.status(200).json({
            success:true,
            message:`Subsection updated successfully`,
        });
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`can't update the subsection, ${err.message}`,
        });
    }
}

exports.deleteSubsection = async (req,res) =>{
    try{
        const {subsectionId,sectionId} = req.body;
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSection: subsectionId,
              },
            },{new:true}
          )
        await Subsection.findByIdAndDelete({subsectionId});
        return res.status(200).json({
            success:true,
            message:`Subsection deleted successfully`,
        });
    }catch(err){
        return res.status(402).json({
            success:false,
            message:`can't delete the subsection, ${err.message}`,
        });
    }
}