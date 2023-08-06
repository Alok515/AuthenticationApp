const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

//transpoter to config the mailer
//transpoter has to be populated with the service provider, host and port
//user and password
let transpoter = nodeMailer.createTransport({
    service: 'mailgun',
    host: 'smtp.mailgun.org',
    port: 587,
    secure: true,
    auth: {
        user: process.env.email,
        pass: process.env.passEmail
    }
});

//render the Mail Tamplate file with ejs render
let renderTemplate = (link, renderPath) => {
    let mailHtml;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', renderPath),
        {
            link,
        },
        (err, template) => {
            if (err) {console.log('Error in Rendering mailers: ' + err); return}
            mailHtml = template;
        }
    );
    return mailHtml;
}

module.exports = {
    transpoter,
    renderTemplate,
}