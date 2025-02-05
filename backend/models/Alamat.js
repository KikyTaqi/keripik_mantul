const mongoose = require("mongoose");

const alamatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  alamat: [
    {
      nama: {
        type: String,
        required: [true, "Nama Alamat is required!"],
      },
      no_telp: {
        type: String,
        required: [true, "No Telepon is required!"],
      },
      kecamatan: { type: String },
      nama_jalan: { type: String },
      detail_lain: { type: String },
      utama: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

// Middleware untuk memastikan hanya satu alamat utama per user
alamatSchema.pre("save", function (next) {
  const alamatList = this.alamat;

  // Cek jika ada lebih dari satu alamat utama
  const utamaCount = alamatList.filter((alamat) => alamat.utama).length;
  if (utamaCount > 1) {
    return next(new Error("Hanya satu alamat utama yang diizinkan per pengguna!"));
  }

  next();
});

module.exports = mongoose.model("Alamat", alamatSchema);
