const Review = require("../models/Ulasan");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");
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
        const productId = req.params.id;
        const Ulasan = await Review.findOne({ productId: productId });
        // console.error("OWNHFSFNAHFEHFDFLAOWEDOP: "+cart) 
      try {
        const Ulasan = await Review.find().sort({ _id: -1 });
        res.status(200).json(Ulasan);
      } catch (error) {
        res.status(500).json({ message: "Server Error" });
      }
};
