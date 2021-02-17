const mongoose = require('mongoose')
const User = mongoose.model('user', new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    field: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: Number,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    image: {
        type: String
    }
}))
module.exports = User;