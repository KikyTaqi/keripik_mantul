const mongoose = require('mongoose');

const alamatSchema = new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    alamat: {
        nama: {
            type: String,
            required: [true, 'Nama Alamat is required!'],
        },
        no_telp: {
            type: String,
            required: [true, 'No Telepon is required!'],
        },
        kecamatan: { type: String },
        nama_jalan: { type: String },
        detail_lain: { type: String },
        utama:{
            type: Boolean,
            // required: [true, 'No Telepon is required!'],
            unique: true,
        },
    },
});

module.exports = mongoose.model('Alamat', alamatSchema);