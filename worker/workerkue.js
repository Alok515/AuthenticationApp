const queue = require('../config/pallerkue');
const {sendMailer} = require('../mailers/sendmail');

queue.process('email', (job, done) => {
    sendMailer(job.data.email, job.data.link);
    done();
});