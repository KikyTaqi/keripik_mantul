const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    transaction_id: {
        type: String,
    },
    first_name: {
        type: String,
    },
    amount: {
        type: Number,
    },
    product_id: {
        type: String,
    },
    midtrans_url: {
        type: String,
    },
})

module.exports = mongoose.model("Transaction", transactionSchema);