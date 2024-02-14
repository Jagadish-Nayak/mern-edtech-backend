const express = require("express");
const route = express.Router();

const {updateProfile,deleteAccount,getAllUserDetails,updateProfilePicture,getEnrolledCourses} = require("../controllers/profile");
const {auth} = require("../middlewares/auth");

route.post("/updateProfile",auth,updateProfile);
route.delete("/deleteAccount",auth,deleteAccount);
route.get("/getUserDetails",auth,getAllUserDetails);
route.get("/getEnrolledCourses",auth,getEnrolledCourses);
route.post("/updateProfilePicture",auth,updateProfilePicture);

module.exports = route;