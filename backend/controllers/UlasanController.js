const Review = require("../models/Ulasan");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getReviews = async (req, res) => {
    try{
        const reviews = await Review.find().sort({_id: -1});
        res.status(200).json(reviews);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

// Tambah review
exports.createReview = async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;
        const {id} = req.params;
        const product = await Product.findOne({_id: id});
        const reviews = await Review.find({ product: id });
        
        
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        
        // Hitung jumlah ulasan dan total rating
        const totalReviews = reviews.length + 1;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        
        // Hitung rata-rata rating (jika ada review)
        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
        product.ulasan = (product.ulasan || 0) + 1;
        product.rating = parseFloat(averageRating);
        product.save();

        console.log("cekulasan: "+JSON.stringify(product));

        const newReview = new Review ({
            user: userId,
            username: req.body.username,
            product: req.params.id,
            rating,
            comment,
            date: new Date().toISOString(),
        });

        //Review.push(newReview);
        await newReview.save();

        res.status(201).json({ message: "Ulasan berhasil ditambahkan!", review: newReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

// Ambil semua review berdasarkan produk
exports.getReviewsByProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID produk tidak valid" });
        }

        const reviews = await Review.find({ product: productId })
            .populate("user", "username") // Ambil username dari koleksi User
            .sort({ _id: -1 });

        console.log("Review ditemukan:", reviews);

        if (reviews.length === 0) {
            return res.status(404).json({ message: "Belum ada ulasan untuk produk ini" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error mengambil ulasan:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getUlasan = async (req, res) => {
    try {
        const ulasan = await Review.find().sort({ _id: -1 });
        res.status(200).json(ulasan); 
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

exports.deleteUlasan = async (req, res) => {
    try {
        const ulasan = await Review.findById(req.params.id);
        //hapus file dari mongodb
        await ulasan.deleteOne();
        res.status(201).json({message: 'Berhasil menghapus kategori'})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Gagal menghapus kategori!'})
    }
};

exports.updateUlasan = async (req, res) => {
    try {
        console.log("Request received:", req.params.id, req.body);

        const { id } = req.params;
        const ulasan = await Review.findById(id);
        
        if (!ulasan) {
            return res.status(404).json({ message: "Ulasan tidak ditemukan" });
        }

        // Toggle status ulasan (contoh: aktif/nonaktif)
        ulasan.isActive = !ulasan.isActive;
        await ulasan.save();

        res.status(200).json({ message: "Ulasan berhasil diupdate", ulasan });
    } catch (error) {
        console.error("Error updating ulasan:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

