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
        no_telp: {
            type: String,
            unique: true,
        },
        tgl_lahir: {
            type: Date,
        },
        jenis_kelamin: {
            type: String,
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
        },
        profile_image: {
            type: String,
            default: "https://res.cloudinary.com/drlckqgew/image/upload/v1738942827/morsxlcuwikchlazjker.png"
        },
        cloudinaryId: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);