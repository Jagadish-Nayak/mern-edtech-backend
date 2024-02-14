const express  = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/User");
const contactRoutes = require("./routes/Contact");
const courseRoutes = require("./routes/Course");
//const paymentRoutes = require("./routes/Payment");
const profileRoutes = require("./routes/Profile");

const {dbConnect} = require("./config/database");
const {connectToCloudinary} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

dbConnect();
app.use(express.json());

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp",
}));
app.use(cookieParser());
app.use(
    cors({
        origin:["http://localhost:3000","https://fluffy-licorice-7ea7d5.netlify.app/"],
        credentials:true,
    })
);
connectToCloudinary();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
//app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactRoutes);

//def route
app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

app.get("/", (req, res) => {
	res.send("<h1>Hello please</h1>")
});

