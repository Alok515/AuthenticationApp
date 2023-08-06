const nodeMailer = require('../config/mailer');

//this the function sends the email
exports.sendMailer = (email, link) => {
    //geting the Template file for the email    
    let htm = nodeMailer.renderTemplate(link,  '/reset.ejs');
    nodeMailer.transpoter.sendMail({
        from: process.env.email,
        //user email
        to: email,
        subject: 'Reset Password',
        html: htm,
    },(err, info) =>{
        if (err) {
            console.log("Error in sending mail: " + err);
            return 0;
        }
        console.log("Sent mail: " + JSON.stringify(info));
        return 1;
    });
}