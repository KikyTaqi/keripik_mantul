const Cart = require("../models/cart");

// Tambah produk ke keranjang
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, price } = req.body;
        const userId = req.user.id; // Pastikan user sudah login

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], total: 0 });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price });
        }

        cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// Hapus produk dari keranjang
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(400).json({ message: "Keranjang tidak ditemukan" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// Dapatkan keranjang user
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) return res.status(404).json({ message: "Keranjang kosong" });

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
