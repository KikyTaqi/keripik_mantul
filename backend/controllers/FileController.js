const cloudinary = require('../config/cloudinary');
const File = require('../models/File');

//upload file ke cloudinary
exports.uploadFile = async (req, res) => {
    try{
        //mengunggah file ke cloudinary
        const result = await cloudinary.uploader.upload(res.file.path);
        
        //simpan informasi file ke mongodb
        const file = new File({
            name: req.file.originalname,
            url: result.secure_url,
            cloudinaryId: result.public_id,
        });

        await file.save();
        res.status(201).json(file);
    }catch (err){
        console.error(err);
        res.status(500).json({error: 'File upload failed!'});
    }
};