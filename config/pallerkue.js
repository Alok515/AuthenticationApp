const kue = require('kue');

//creating a new queue for handling parallel requests
const queue = kue.createQueue();

module.exports = queue;