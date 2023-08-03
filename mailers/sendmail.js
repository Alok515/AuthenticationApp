const nodeMailer = require('../config/mailer');

exports.sendMailer = (user) => {
    console.log("inside sendMail");

    nodeMailer.transpoter.sendMail({
        from: 'postmaster@sandboxfd0debbbc90646a79f7f4b8bc7a5999d.mailgun.org',
        to: user.email,
        subject: 'Test Of the NodeMailer',
        html: '<h1>Test Of The NodeMailer</h1><div style="background-color: #555"> <p>if you recived the mail Please dont mind.</p></div>'
    },(err, info) =>{
        if (err) {
            console.log("Error in sending mail: " + err);
            return;
        }
        console.log("Sent mail: " + JSON.stringify(info));
        return;
    });
}