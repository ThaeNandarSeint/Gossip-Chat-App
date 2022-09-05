const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"]
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: 'https://res.cloudinary.com/dnos24ywq/image/upload/v1656583141/Profile/profile_syxgfb.png'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)