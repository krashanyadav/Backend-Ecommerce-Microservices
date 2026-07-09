const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength:6
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profileImage: {
      type: String,
      default: "",
    },
    resetOtp: {
        type: String,
        default: null
    },

    resetOtpExpire: {
        type: Date,
        default: null
    },
    otpVerified: {
    type: Boolean,
    default: false
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
},{timestamps:true}) 


const userModel = mongoose.model("User",userSchema)

module.exports = userModel