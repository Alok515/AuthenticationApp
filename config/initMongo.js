const mongoose = require('mongoose');

mongoose.connect(process.env.DataBase)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error(err);
    });