const mongoose = require('mongoose')

const otpschema = new mongoose.Schema({
  otp: { type: String, required: true },
  email: { type: String },
  createdAt: { type: Date, default: Date.now(), expires: 3000 },
});


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthMonth: { type: Number },
    birthYear: { type: Number },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    profilePicture: { type: String },
    bio: { type: String }, 
    lastLogin: { type: Date },
    updatedAt: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    isEmailVerified:{type:Boolean,default:false}
})

const User = mongoose.model('User',userSchema)
const OTP = mongoose.model("otps", otpschema);


module.exports = {User,OTP}