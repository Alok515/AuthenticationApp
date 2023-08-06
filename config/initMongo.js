const mongoose = require('mongoose');

//mongoDB Setup using mongoose
mongoose.connect(process.env.DataBase)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error(err);
    });