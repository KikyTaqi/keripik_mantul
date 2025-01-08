const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
        required: [true, 'Password is required'],
    },
})

module.exports = mongoose.model("User", userSchema);