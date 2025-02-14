const mongoose = require('mongoose');

console.log("✅ Product model loaded"); // Debugging

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!']
    },
    stok: {
        type: Number,
        required: [true, 'Stok is required!'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
    },
    terjual: {
        type: Number,
    },
    ulasan: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    category_id: {
        type: String,
        required: [true, 'Category is required!'],
    },
    thumbnail: {
        type: String,
        required: true,
    },
    cloudinaryId: {
        type: String,
    },
});

module.exports = mongoose.model('Product', ProductSchema);