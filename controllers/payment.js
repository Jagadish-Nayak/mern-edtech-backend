// const { default: mongoose } = require("mongoose");
// const {instance} = require("../config/razorpay");
// const Course = require("../models/Course");
// const {mail} = require("../utils/sendMail");

// exports.capturePayment = async(req,res) =>{
//     try{
//         //fetch data
//         //course validation
//         //check the user is already enrolled in the course or not
//         //create an order
//         //return response
//         const {courseId} = req.body;
//         const userId = req.user.id;
//         if(!courseId){
//             return res.status(400).json({
//                 success:false,
//                 message:"Can't find the course id in the request"
//             })
//         }
//         const course = Course.findById({courseId});
//         if(!course){
//             return res.status(400).json({
//                 success:false,
//                 message:"course not found",
//             })
//         }
//         const uid = new mongoose.Schema.Types.ObjectId(userId);
//         if(course.studentEnrolled.includes(uid)){
//             return res.status(400).json({
//                 success:false,
//                 message:"User has already purchased this course",
//             })
//         }
//         const price = course.price;
//         const options={
//             "amount": price*100,
//             "currency": "INR",
//             receipt: Math.random(Date.now()).toString(),
//             notes:{
//                 userId:userId,
//                 courseId:courseId,
//             }
//         }
//         try{
//             const orderDetails = await instance.orders.create(options);
//             return res.status(200).json({
//                 success:ture,
//                 message:"order initiated successfully",
//                 data:{
//                     courseName:course.title,
//                     courseDesc:course.description,
//                     courseThumbnail:course.thumbnail,
//                     coursePrice:course.price,
//                     orderId:orderDetails.receipt,
//                 }
//             })
//         }catch(err){
//             return res.status(400).json({
//                 success:false,
//                 message:"can't initiate order",
//             })
//         }

//     }catch(err){
//         return res.status(400).json({
//             success:false,
//             message:"can't capture the payment for this particular course",
//         })
//     }
// }

// exports.authorisePayment = async(req,res)=>{
//     try{
//         const webhookSecret = process.env.WEBHOOK_SECRET;
//         const signature = req.headers["x-razorpay-signature"];
//         const shasum = crypto.createHmac("sha256",webhookSecret);
//         shasum.update(JSON.stringify(req.body));
//         const digest = shasum.digest(shasum);
//         if(digest===signature){
//             const {userId,courseId} = req.body.payload.payment.entity.notes;
//             const course = await Course.findByIdAndUpdate({courseId},{$push:{studentEnrolled:userId}},{new:true});
//             if(!course){
//                 return res.status(400).json({
//                     success:false,
//                     message:"Can't find the course",
//                 })  
//             }
//             const user = await User.findByIdAndUpdate({userId},{$push:{enrolledCourses:courseId}},{new:true});
//             console.log(user);
//             const sendmail = mail(user.email,"Regarding the course enrollment",
//                                                 `Congratulations! You have successfully enrolled in to the course ${course.title}`);
//             console.log(sendmail);
//         }else{
//             return res.status(400).json({
//                 success:false,
//                 message:"the signature does not matches with the webhook Secret",
//             }) 
//         }
//     }catch(err){
//         return res.status(400).json({
//             success:false,
//             message:"Can't authorise the payment",
//         })
//     }
// }