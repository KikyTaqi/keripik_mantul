const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
    name_kategori: {
        type: String,
        required: [true, 'Nama Kategori is required!'],
    },
});

module.exports = mongoose.model('Kategori', kategoriSchema);