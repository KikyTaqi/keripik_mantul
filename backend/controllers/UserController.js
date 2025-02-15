const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const jwt = require('jsonwebtoken');              
const secretkey = process.env.JWT_SECRET;

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().limit(5);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const users = await User.find({'role': 'User'}).sort({ _id: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getProfile = async (req, res) => {
    const {email} = req.body;
    try {
        const users = await User.find({'email': email});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.editProfile = async (req, res) => {
    try {
        const id = req.body.id;
        let user = await User.findOne({'_id': id});
        if(!user){
            res.status(500).json({ message: 'User tidak ditemukan!', user });
        }
        
        let updateUser = {};
        let upload = null;
        
        // Konversi tanggal lahir jika ada
        // let tanggalInput = req.body.tgl_lahir || null;
        // let formattedDateInput = null;
        // if (tanggalInput !== null && tanggalInput !== undefined && !isNaN(new Date(tanggalInput).getTime())) {
            //     formattedDateInput = new Date(tanggalInput).toISOString().split("T")[0];
            // }
            
            // Cek apakah ada file yang diunggah
        if (req.file) {
            console.log("checkImage: " + req.file.path);
            upload = await cloudinary.uploader.upload(req.file.path);
            if (upload) {
                if (upload.secure_url != null && upload.secure_url != undefined) {
                    updateUser.profile_image = upload.secure_url;
                }
                if (upload.public_id != null && upload.public_id != undefined) {
                    updateUser.cloudinaryId = upload.public_id;
                }
            }
        }
        console.log("WOJLKANFLFNOA: "+req.body.tgl_lahir);
        // Update hanya jika ada perubahan dari req.body
        if (req.body.nama != null && req.body.nama != undefined && req.body.nama != "") {
            console.log("edskfosfn");
            updateUser.name = req.body.nama || user.name;
        }

        if (req.body.no_telp !== null && req.body.no_telp !== undefined && req.body.no_telp != "") {
            updateUser.no_telp = req.body.no_telp;
        }else{
            updateUser.no_telp = user.no_telp;
        }

        if (req.body.tgl_lahir != null && req.body.tgl_lahir != undefined && req.body.tgl_lahir != "undefined" && req.body.tgl_lahir != "") {
            updateUser.tgl_lahir = req.body.tgl_lahir;
        }else{
            updateUser.tgl_lahir = user.tgl_lahir;
        }

        if (req.body.jenis_kelamin !== null && req.body.jenis_kelamin !== undefined && req.body.jenis_kelamin != "") {
            updateUser.jenis_kelamin = req.body.jenis_kelamin;
        }else{
            updateUser.jenis_kelamin = user.jenis_kelamin;
        }

        console.log("Update Data:", updateUser);

        // else{
        //     updateUser = {
        //         name: req.body.nama,
        //         // email: req.body.email,
        //         no_telp: req.body.no_telp,
        //         tgl_lahir: req.body.tgl_lahir,
        //         jenis_kelamin: req.body.jenis_kelamin,
        //     }
        // }
        user = await User.findByIdAndUpdate(id, updateUser, {new: true});

        const userPayload = {
            _id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
        }

        const userToken = jwt.sign(userPayload, secretkey, { expiresIn: '1h' });
        res.status(200).json({ message: 'Profile updated successfully!', token: userToken });
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.editProfilePassword = async (req, res) => {
    const id = req.body.id;
    try {
        let user = await User.findOne({'_id': id});
        if(!user){
            return res.status(400).json({ message: 'User tidak ditemukan!' });
        }
        if(req.body.password == null){
            const updateUser = {
                password: req.body.newPassword
            }
            user = await User.findByIdAndUpdate(id, updateUser, {new: true});
        }else{
            if(user.password == req.body.password){
                const updateUser = {
                    password: req.body.newPassword
                }
                user = await User.findByIdAndUpdate(id, updateUser, {new: true});
            }else{
                return res.status(400).json({ message: 'Password tidak sama!' });
            }
        }
        return res.status(200).json({ message: 'Profile updated successfully!' });
    }catch (err) {
        return res.status(400).json({ message: err, err });
    }
}