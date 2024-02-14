const cloudinary = require("cloudinary").v2;

exports.uploadFile = async (file,folder)=>{
    try{
        const options = {folder};
        // if(quality){
        //     options.quality = quality;
        // }
        // if(height){
        //     options.height = height;
        // }
        options.resource_type = "auto";
        const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath,options); 
        return uploadedFile;
    }catch(err){
        console.log(err.message);
    }
}

