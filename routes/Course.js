const express = require("express");
const route = express.Router();

const {createCourse,showAllCourses,showCourseDetails} = require("../controllers/course");
const {createSection,updateSection,deleteSection} = require("../controllers/section");
const {createCategory,showAllCategories,getCategoryDetails} = require("../controllers/category");
const {createSubsection,updateSubsection,deleteSubsection} = require("../controllers/subsection");
const {createRating,getAverageRating,allRating} = require("../controllers/ratingsAndReviews");
const {auth,isStudent,isInstructor,isAdmin} = require("../middlewares/auth");

route.post("/createCategory",auth,isAdmin,createCategory);
route.get("/showAllCategories",showAllCategories);
route.post("/getCategoryDetails",getCategoryDetails);

route.post("/createCourse",auth,isInstructor,createCourse);
route.post("/addSection",auth,isInstructor,createSection);
route.post("/addSubsection",auth,isInstructor,createSubsection);
route.post("/updateSection",auth,isInstructor,updateSection);
route.post("/deleteSection",auth,isInstructor,deleteSection);
route.post("/updateSubsection",auth,isInstructor,updateSubsection);
route.post("/deleteSubsection",auth,isInstructor,deleteSubsection);
route.get("/getAllCourses",showAllCourses);
route.post("/getCourseDetails",showCourseDetails);

route.post("/createRating",auth,isStudent,createRating);
route.get("/getAverageRating",getAverageRating);
route.get("/getReviews",allRating);

module.exports = route;

