const express = require("express");
const route= express.Router();
const {contactUs} = require("../controllers/contactUs");

route.post("/contact",contactUs);

module.exports = route;