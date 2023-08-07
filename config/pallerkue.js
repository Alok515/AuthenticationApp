const kue = require('kue');

//creating a new queue for handling parallel requests
const queue = kue.createQueue({
    redis: process.env.REDIS_URL,
});

module.exports = queue;