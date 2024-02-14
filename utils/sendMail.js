const transporter = require("../config/mailsender");

exports.mail = async(email,title,body) =>{
    try{
        console.log(email,title,body);
        const mailInfo = await transporter.sendMail({
            from: "NewsAtBlink || From Team NewsAtBlink",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(mailInfo);
    }catch(err){
        console.log("Can't send Mail");
        console.log(err.message);
    }
}