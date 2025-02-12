const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: {type: String},
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true},
});

module.exports = mongoose.model("Review", reviewSchema);
