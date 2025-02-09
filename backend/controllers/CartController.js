const Cart = require("../models/cart");

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