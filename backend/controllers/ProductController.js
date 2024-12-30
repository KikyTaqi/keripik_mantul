const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');

//mendapatkan semua produk
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products); 
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

exports.getDetailProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findById(id);

        if(!product) {
            return res.status(404).json({message: "Product not found!"});
        }
        res.json(product);
    } catch (err) {
        console.error(error);
        res.status(500).json({message: 'Server error!'})
    }
};