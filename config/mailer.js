const nodeMailer = require('nodemailer');
const ejs = require('ejs');

let transpoter = nodeMailer.createTransport({
    service: 'mailgun',
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
        user: 'postmaster@sandboxfd0debbbc90646a79f7f4b8bc7a5999d.mailgun.org',
        pass: 'Krishna'
    }
});

let renderTemplate = (data, renderPath) => {
    let mailHtml;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', renderPath),
        data,
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