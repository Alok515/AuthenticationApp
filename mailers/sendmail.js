const nodeMailer = require('../config/mailer');

exports.sendMailer = (email, link) => {
    
    let htm = nodeMailer.renderTemplate(link,  '/reset.ejs');
    nodeMailer.transpoter.sendMail({
        from: process.env.email,
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