const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

//konfigurasi cloudinary
cloudinary.config({
    cloud_name: process.env.CLUDINARY_CLOUD_NAME,
    api_key: process.env.CLUDINARY_API_KEY,
    api_secret: process.env.CLUDINARY_API_SECRET,
});

module.exports = cloudinary;