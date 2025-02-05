const Alamat = require("../models/Alamat");

// Ambil cart berdasarkan userId
exports.getAlamat = async (req, res) => {
    const userId = req.params.id;
    const alamat = await Alamat.findOne({ userId: userId });
    try {
        res.status(200).json(alamat || { userId: req.params, alamat: [] });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Tambah produk ke cart
exports.addAlamat = async (req, res) => {
    const { userId, no_telp, nama, kecamatan, nama_jalan, detail_lain, utama } = req.body;
  
    console.log("UTAAAA: "+utama);
    try {
        let alamat = await Alamat.findOne({ userId });

        console.log("HEHE: "+alamat);
        
        if (!alamat) {
            alamat = new Alamat({ userId, items: [] });
            console.log("HEHE2: "+alamat);
        }
        console.log("HEHE22: "+alamat);
        
        if(utama == true){
            const existingItem = alamat.alamat.find((item) => item.utama === true);
            
            if (existingItem) {
                existingItem.utama = false
            }
            console.log("HEHE222: "+alamat);
        }
        alamat.alamat.push({ nama, no_telp, kecamatan, nama_jalan, detail_lain, utama });
        console.log("HEHE2222: "+alamat);

        console.log(alamat);

        await alamat.save();
        res.status(200).json( alamat );
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

exports.changePrimary = async (req, res) => {
    const { userId, id } = req.body;
  
    try {
        let alamat = await Alamat.findOne({ userId });

        
        if (!alamat) {
            res.status(500).json({ message: "Alamat tidak ditemukan" });
        }
        
        const existingItem = alamat.alamat.find((item) => item.utama === true);
        const primary = alamat.alamat.find((item) => item._id == id);
        
        if (existingItem) {
            existingItem.utama = false
        }
        
        primary.utama = true;
        console.log(alamat);

        await alamat.save();
        res.status(200).json( alamat );
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};
  

// Hapus produk dari cart
exports.removeAlamat = async (req, res) => {
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