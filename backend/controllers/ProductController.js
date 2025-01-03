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

exports.createProduct = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        
        //membuat produk dengan data dari body dan menambahkan tumbnail URL
        const product = new Product({
            ...req.body,
            thumbnail: result?.secure_url,
            cloudinaryId: result?.public_id,
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({mesasge: err.message});
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        //hapus file dari cloudinary
        await cloudinary.uploader.destroy(product.cloudinaryId);

        //hapus file dari mongodb
        await product.deleteOne();

        res.status(201).json({message: 'Berhasil menghapus produk'})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Gagal menghapus produk!'})
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        //cari produk by id
        let product = await Product.findById(id);
        if (!product){
            return res.status(404).json({message: 'Product not found!'})
        }

        //jika ada file diunggah, update gambar di cloudinary
        console.log('req.file', req.file);
        
        let result;
        if (req.file){
            //hapus gambar lama
            await cloudinary.uploader.destroy(product.cloudinaryId);

            //Unggah gambar baru
            result = await cloudinary.uploader.upload(req.file.path)
        }

        //simpan pembaruan ke database
        product = await Product.findByIdAndUpdate(id, updatedProduct, {new: true});
        
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};