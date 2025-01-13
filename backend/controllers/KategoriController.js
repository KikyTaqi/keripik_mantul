const Kategori = require('../models/Kategori');

//mendapatkan semua produk
exports.getKategori = async (req, res) => {
    try {
        const kategori = await Kategori.find();
        res.status(200).json(kategori); 
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

exports.createKategori = async (req, res) => {
    try {
        console.log('req.body:', req.body);
        const kategori = new Kategori({
                    name_kategori: req.name,
                    ...req.body,
                });
        await kategori.save();
        res.status(201).json(kategori);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(400).json({ message: err.message });
    }
};


exports.deleteKategori = async (req, res) => {
    try {
        const kategori = await Kategori.findById(req.params.id);
        //hapus file dari mongodb
        await kategori.deleteOne();
        res.status(201).json({message: 'Berhasil menghapus kategori'})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Gagal menghapus kategori!'})
    }
};

exports.updateKategori = async (req, res) => {
    try {
        const { id } = req.params;

        //cari produk by id
        let kategori = await Kategori.findById(id);
        console.error("findKategori: "+kategori);
        if (!kategori){
            return res.status(404).json({message: 'Kategori not found!'})
        }
        //simpan pembaruan ke database
        console.error("findKategori2: "+kategori);
        kategori = await Kategori.findByIdAndUpdate(id, {new: true});
        res.status(200).json(kategori);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};