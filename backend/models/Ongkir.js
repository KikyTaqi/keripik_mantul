const mongoose = require('mongoose');

const ongkirSchema = new mongoose.Schema({
    jarak_min: {
        type: Number,
        required: [true, 'Jarak Minimal is required!'],
    },
    jarak_max: {
        type: Number,
        required: [true, 'Jarak Maksimal is required!'],
    },
    ongkir: {
        type: Number,
        required: [true, 'Ongkir is required!'],
    }
});

module.exports = mongoose.model('Ongkir', ongkirSchema);