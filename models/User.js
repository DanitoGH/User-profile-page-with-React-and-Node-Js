const mongoose  = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    email: {
       type: String,
       required: true,
       unique: true
    },
    phone: {
        type: String,
        required: false
    },
    photo: {
        type: String,
        required: false
    },
    refreshToken: {
      type: String,
      require: true
    },
    password: {
        type: String,
        required: true,
    },
    lastLogin: {
       type: String,
       required: false,
    }
}, 
{
    timestamps: true
})

const User = mongoose.model('user', userSchema)
module.exports = User