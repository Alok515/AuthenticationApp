const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    email: { 
        type: 'string',
        required: true
    },
    password: { 
        type: 'string',
        required: true
    },
    date : { 
        type: 'date',
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;