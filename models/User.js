const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    contact:{
        type:Number,
        maxLength:12,
    },
    accountType:{
        type:String,
        enum:["Student","Instuctor","Admin"],
        required:true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    imageUrl:{
        type:String,
        required:true,
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
    }],
    resetPasswordToken:{
        type:String,
    },
    expireResetPasswordToken:{
        type:Date,
    }
},{ timestamps: true });

module.exports = mongoose.model("User",userSchema);