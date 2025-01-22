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
        const users = await User.find({'role': 'User'});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getProfile = async (req, res) => {
    const {email} = req.body;
    try {
        const users = await User.find({'email': email});
        console.log(users);
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