const User = require('../models/User');

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
        let user = await User.find({'_id': id});
        if(!user){
            res.status(500).json({ message: 'User tidak ditemukan!', user });
        }
        const updateUser = {
            name: req.body.nama,
            // email: req.body.email,
            no_telp: req.body.no_telp,
        }
        user = await User.findByIdAndUpdate(id, updateUser, {new: true});
        console.log("User: "+user);
        res.status(200).json({ message: 'Profile updated successfully!' });
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
        if(user.password == req.body.password){
            const updateUser = {
                password: req.body.newPassword
            }
            user = await User.findByIdAndUpdate(id, updateUser, {new: true});
        }else{
            return res.status(400).json({ message: 'Password tidak sama!' });
        }
        return res.status(200).json({ message: 'Profile updated successfully!' });
    }catch (err) {
        return res.status(400).json({ message: err, err });
    }
}