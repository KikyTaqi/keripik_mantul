const Review = require("../models/Ulasan");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getReviews = async (req, res) => {
    try{
        const reviews = await Ulasan.find().sort({_id: -1});
        res.status(200).json(reviews);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

// Tambah review
exports.createReview = async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

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
