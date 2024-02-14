const jwt = require("jsonwebtoken");
require("dotenv").config();
//auth
exports.auth = async(req,res,next) =>{
    try{
        const token = req.cookies.token ||
                         req.body.token ||
                         req.header("Authorisation").replace("Bearer ", "")
        if(!token){
            return res.status(400).json({
                success:false,
                message:"token not found",
            })
        }
        const payload = await jwt.verify(token,process.env.JWT_SECRET);
        if(!payload){
            return res.status(400).json({
                success:false,
                message:"token is invalid",
            })
        }    
        req.user = payload;
        next();    
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`Can't authenticate the user, ${err.message}`,
        })
    }
}

//isStudent
exports.isStudent = async(req,res,next) =>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success:false,
                message:"This is protected route for students only",
            })
        }
        next();
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"can't authorise the user",
        })
    }
}

//isInstructor
exports.isInstructor = async(req,res,next) =>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(400).json({
                success:false,
                message:"This is protected route for Instructor only",
            })
        }
        next();
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"can't authorise the user",
        })
    }
}

//isAdmin
exports.isAdmin = async(req,res,next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(400).json({
                success:false,
                message:"This is protected route for Admins only",
            })
        }
        next();
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"can't authorise the user",
        })
    }
}