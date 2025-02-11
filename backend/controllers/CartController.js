const Cart = require("../models/cart");
const User = require("../models/User");

// Ambil cart berdasarkan userId
exports.getCart = async (req, res) => {
    const userId = req.params.id;
    const cart = await Cart.findOne({ userId: userId });
    // console.error("OWNHFSFNAHFEHFDFLAOWEDOP: "+cart) 
  try {
    res.status(200).json(cart || { userId: req.params, items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Tambah produk ke cart
exports.addToCart = async (req, res) => {
    const { userId, productId, name, price, thumbnail } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      const existingItem = cart.items.find((item) => item.productId === productId);
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ productId, name, price, thumbnail, quantity: 1 });
      }

      console.log(cart);
  
      await cart.save();
      res.status(200).json( cart );
  
    } catch (error) {
      console.error("Error in addToCart:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
  };
  

// Hapus produk dari cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { userId, productId, type } = req.body;
    console.log("Product ID:", productId);

    // Cari cart berdasarkan userId
    const cartItem = await Cart.findOne({ userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Cari produk di dalam array items
    const productIndex = cartItem.items.findIndex((item) => item.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update quantity produk tertentu
    cartItem.items[productIndex].quantity = type === "increase" 
      ? cartItem.items[productIndex].quantity + 1 
      : Math.max(1, cartItem.items[productIndex].quantity - 1);

    // Simpan perubahan ke database
    await cartItem.save();

    res.json({ message: "Quantity updated", cart: cartItem });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Server error", error });
  }
};