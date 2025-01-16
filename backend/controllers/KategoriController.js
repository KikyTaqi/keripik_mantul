const Kategori = require('../models/Kategori');
const Ongkir = require('../models/Ongkir');

//mendapatkan semua produk
exports.getKategori = async (req, res) => {
    try {
        const kategori = await Kategori.find();
        res.status(200).json(kategori); 
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

exports.getDetailKategori = async (req, res) => {
    try {
        const { id } = req.params;
        console.error("id: "+id);
        
        const kategori = await Kategori.findById(id);
        console.error("kategori: "+kategori);

        if(!kategori) {
            return res.status(404).json({message: "Kategori not found!"});
        }
        return res.json(kategori);
    } catch (err) {
        console.error(error);
        return res.status(500).json({message: 'Server error!'})
    }
};

exports.createKategori = async (req, res) => {
    try {
        console.log('req.body:', req.body);
        const kategori = new Kategori({
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
        const { nama } = req.body;

        //cari produk by id
        let kategori = await Kategori.findById(id);
        console.error("findKategori: "+kategori);
        if (!kategori){
            return res.status(404).json({message: 'Kategori not found!'})
        }
        //simpan pembaruan ke database
        const updateKategori = {
            ...req.body,
        }
        kategori = await Kategori.findByIdAndUpdate(id, updateKategori, {new: true});
        console.error("findKategori2: "+kategori);
        res.status(200).json(kategori);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

// ONGKRIR
exports.getOngkir = async (req, res) => {
    try {
        const ongkir = await Ongkir.find();
        res.status(200).json(ongkir); 
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

exports.getDetailOngkir = async (req, res) => {
    try {
        const { id } = req.params;
        console.error("id: "+id);
        
        const ongkir = await Ongkir.findById(id);
        console.error("ongkir: "+ongkir);

        if(!ongkir) {
            return res.status(404).json({message: "Ongkir not found!"});
        }
        return res.json(ongkir);
    } catch (err) {
        console.error(error);
        return res.status(500).json({message: 'Server error!'})
    }
};

exports.createOngkir = async (req, res) => {
    try {
        console.log('req.body:', req.body);
        const ongkir = new Ongkir({
                    ...req.body,
                });
        await ongkir.save();
        res.status(201).json(ongkir);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(400).json({ message: err.message });
    }
};


exports.deleteOngkir = async (req, res) => {
    try {
        const ongkir = await Ongkir.findById(req.params.id);
        //hapus file dari mongodb
        await ongkir.deleteOne();
        res.status(201).json({message: 'Berhasil menghapus ongkir'})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Gagal menghapus ongkir!'})
    }
};

exports.updateOngkir = async (req, res) => {
    try {
        const { id } = req.params;
        const { jarak_min, jarak_max, ongkir } = req.body;

        //cari produk by id
        let ongkirFind = await Ongkir.findById(id);
        console.error("findOngkir: "+ongkirFind);
        if (!ongkirFind){
            return res.status(404).json({message: 'Kategori not found!'})
        }
        //simpan pembaruan ke database
        const updateOngkir = {
            ...req.body,
        }
        ongkirFind = await Ongkir.findByIdAndUpdate(id, updateOngkir, {new: true});
        console.error("findOngkir2: "+ongkirFind);
        res.status(200).json(ongkirFind);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};