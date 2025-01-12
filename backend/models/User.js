const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        role: {
            type: String,
            default: "User",
        },
        password: {
            type: String,
        },
        otp: {
            otp: { type: String },
            sendTime: { type: Number },
            token: { type: String },
        },
        isRegistered: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);