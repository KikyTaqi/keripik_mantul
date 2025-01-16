const mongoose = require('mongoose');

const pesananSchema = new mongoose.Schema({
    nama_kategori: {
        type: String,
        required: [true, 'Nama Kategori is required!'],
    },
});

module.exports = mongoose.model('Kategori', pesananSchema);