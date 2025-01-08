const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
    },
    thumbnail: {
        type: String,
        required: true,
    },
    cloudinaryId: {
        type: String,
    },
});

module.exports = mongoose.model('Products', productSchema);