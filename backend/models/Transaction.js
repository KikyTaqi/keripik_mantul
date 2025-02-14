const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transaction_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  gross_amount: { type: Number, required: true },
  item_details: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      image: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  alamat_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  midtrans_url: { type: String, required: true },
  status: { type: String, enum: ["pending","diproses", "dikirim", "selesai"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
