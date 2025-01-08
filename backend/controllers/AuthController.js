const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Sign In (Login) 
exports.signIn = async (req, res) => {
    console.log('req', req.body );
    const { email, password } = req.body;

    try {
        //cek apakah pengguna terdaftar
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({message: 'User not register'});
        }else {
            if (user.password !== password){
                return res.status(401).json({message: 'Email and password did not match'});
            }
        }

        //berikan token
        res.json({
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            token: generateToken(user._id),
        });
    }catch (err) {
        res.status(500).json({message: res});
    }

};