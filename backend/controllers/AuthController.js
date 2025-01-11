const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Sign In (Login) 
exports.signIn = async (req, res) => {
    const {email} = req.body;
    const user = User.findOne({email: email});
    if (!user) {
        return res.status(401).json({message: 'User not registered'});
    }
    const token = generateToken(user._id);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mantulchips@gmail.com',
          pass: 'keripikmantul123'
        }
      });
      
      var mailOptions = {
        from: 'mantulchips@gmail.com',
        to: 'elemari502@gmail.com',
        subject: 'Reset Password',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
};

exports.signUp = async (req, res) => {
    console.log('req', req.body);
    const { email, password, name, role } = req.body;

    try {
        // Cek apakah pengguna sudah terdaftar
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already registered' });
        }

        // Buat pengguna baru
        const newUser = new User({
            name,
            email,
            password,
            role: role || 'User', // Atur default role jika tidak diberikan
        });

        // Simpan pengguna ke database
        await newUser.save();

        // Berikan token
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            role: newUser.role,
            email: newUser.email,
            token: generateToken(newUser._id),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.sendEmail = async (req, res) => {
    const {email} = req.body;
    const user = User.findOne({email: email});
    if (!user) {
        return res.status(401).json({message: 'User not registered'});
    }
    const token = generateToken(user._id);
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN
        }
      });
      
      var mailOptions = {
        from: process.env.GMAIL,
        to: 'rifqiramandhani3@gmail.com',
        subject: 'Reset Password',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
};

// const {email} = req.body;
//     const user = User.findOne({email: email});
//     if (!user) {
//         return res.status(401).json({message: 'User not registered'});
//     }
//     const token = generateToken(user._id);
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'mantulchips@gmail.com',
//           pass: 'keripikmantul123'
//         }
//       });
      
//       var mailOptions = {
//         from: 'mantulchips@gmail.com',
//         to: 'elemari502@gmail.com',
//         subject: 'Reset Password',
//         text: 'That was easy!'
//       };
      
//       transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });

// console.log('req', req.body );
//     const { email, password } = req.body;

//     try {
//         //cek apakah pengguna terdaftar
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({message: 'User not register'});
//         }else {
//             console.error(user.password+" "+password);
//             if (user.password !== password){
//                 return res.status(401).json({message: 'Email or password did not match'});
//             }
//         }

//         //berikan token
//         res.json({
//             _id: user._id,
//             name: user.name,
//             role: user.role,
//             email: user.email,
//             token: generateToken(user._id),
//         });
//     }catch (err) {
//         res.status(500).json({message: res});
//     }