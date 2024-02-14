const mongoose = require("mongoose");
const Subsection = require("./Subsection");

const sectionSchema = new mongoose.Schema({
    sectionName:{
        type:String,
        required:true,
    },
    subSection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subsection",
        required:true,
    }],
});

module.exports = mongoose.model("Section",sectionSchema);