const queue = require('../config/pallerkue');
const {sendMailer} = require('../mailers/sendmail');

//this a queue Worker which manages the jobs assigned to the queue it uses the redis server connection
queue.process('email', (job, done) => {
    sendMailer(job.data.email, job.data.link);
    done();
});