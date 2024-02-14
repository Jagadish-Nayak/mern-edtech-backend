const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
    },
    dob:{
        type:String,
    },
    about:{
        type:String,
       
    },
    contact:{
        type:Number,
        maxLength:12,
    },
});

module.exports = mongoose.model("Profile",profileSchema);