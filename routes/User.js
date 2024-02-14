const express = require("express");
const route = express.Router();

const {sendOtp,signup,login,changePassword} = require("../controllers/Auth");
const {auth} = require("../middlewares/auth");
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword")

route.post("/signup",signup);
route.post("/login",login);
route.post("/sendOtp",sendOtp);
route.post("/changePassword",auth,changePassword);

route.post("/reset-password-token",resetPasswordToken);
route.post("/reset-password",resetPassword);

module.exports = route;