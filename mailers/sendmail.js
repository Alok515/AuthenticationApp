const nodeMailer = require('../config/mailer');

exports.sendMailer = (user) => {
    
    let htm = nodeMailer.renderTemplate(user, '/reset.ejs');
    nodeMailer.transpoter.sendMail({
        from: process.env.email,
        to: user.email,
        subject: 'Test Of the NodeMailer',
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