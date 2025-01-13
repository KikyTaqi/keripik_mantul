const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("853769351673-tv8qth8b3g3of3r046nni0obf0hklcpg.apps.googleusercontent.com");

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
        const user = await User.findOne({ email: email });
        const userIsReg = await User.findOne({ email: email, isRegistered: true });
        if (!user) {
            return res.status(401).json({message: 'User not registered'});
        }else {
          console.error(user.password+" "+password);
          if (user.password !== password){
            return res.status(401).json({message: 'Email or password did not match'});
          }
        }
        if(!userIsReg){
          return res.status(401).json({message: 'You need to confirm your account', reg: true});
        }

        //berikan token
        res.json({
            _id: user._id,
            role: user.role,
            email: user.email,
            token: generateToken(user._id),
        });
    }catch (err) {
        res.status(500).json({message: res});
    }
};

exports.signInGoogle = async (req, res) => {
  const { token } = req.body;

  try {
      const ticket = await client.verifyIdToken({
          idToken: token, // Token dari frontend
          audience: process.env.GMAIL_CLIENT_ID, // Client ID di Google Cloud Console
      });

      const payload = ticket.getPayload();
      console.log('User Info:', payload);

      // Cek atau buat user di database
      let user = await User.findOne({ email: payload.email });
      if (!user) {
          user = new User({
              email: payload.email,
              name: payload.name,
              role: 'User', // Default role
          });
          await user.save();
      }

      res.status(200).json({
          message: 'Login successful',
          _id: user._id,
          role: user.role,
          email: user.email,
          token: generateToken(user._id),
      });
  } catch (err) {
      console.error('Error verifying Google token:', err);
      res.status(401).json({ message: 'Invalid token' });
  }
};

exports.sendConfirmAccount = async (req, res) => {
  var { email, otp, token } = req.body;
  console.log("Hehey "+ req.body);
  if(otp == "" && token == ""){
    const user = await User.findOne({ email: email, isRegistered: false });
    if(!user){
      return res.status(401).json({ message: "Something went wrong"});
    }

    otp = Math.floor(Math.random()*9000)+1000;
    user.otp.otp = otp;
    user.otp.sendTime = new Date().getTime() +9999*60*1000;
    await user.save();
    token = user.otp.token;
    console.log("Hehey not bad");
  }
  const formatedEmail = email.toLowerCase();
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
    from: 'Keripik Mantul <process.env.GMAIL>',
    to: formatedEmail,
    subject: 'Confirm Account - Keripik Mantul',
    text: 
    `Halo ${formatedEmail},
    Kami menerima permintaan untuk mengkonfirmasi akun Anda di Keripik Mantul. Jika Anda yang membuat permintaan ini, silakan gunakan kode OTP berikut untuk melanjutkan proses reset password Anda:
    
    🔑 Kode OTP: ${otp}

    Jika Anda tidak melakukan permintaan ini, abaikan email ini dan pastikan akun Anda aman. Jika Anda membutuhkan bantuan lebih lanjut, hubungi kami di ${process.env.GMAIL}.

Terima kasih telah mempercayai Keripik Mantul!
Salam hangat,
Tim Keripik Mantul`
  };
  
  await transporter.sendMail(mailOptions);
  res.status(200).json({ message: 'OTP sent to your email',token});
}

exports.confirmAccount = async (req, res) => {
  const {email, password} = req.body;
  const formatedEmail = email.toLowerCase();
  
  const user = new User({
    email,
    password,
    role: 'User', // Atur default role jika tidak diberikan
    isRegistered: false
  });
  try{
    await user.save();
  }catch(error){
    return res.status(401).json({ message: 'Email is already in use!' });
  }
  if(user.otp.otp){
    const dateNow = new Date().getTime  ;
    const userDate = new Date(user.otp.sendTime).getTime();
    if(userDate > dateNow){
      return res.status(400).json({ message: `Please wait until ${new Date(
          user.otp.sendTime
        ).toLocaleTimeString()}` });
    }
  }

  const otp = Math.floor(Math.random()*9000)+1000;
  console.log(otp);
  const token = crypto.randomBytes(32).toString('hex');

  user.otp.otp = otp;
  user.otp.sendTime = new Date().getTime() +9999*60*1000;
  user.otp.token = token;

  await user.save();
  res.status(200).json({ message: 'Sending OTP to your email', user});
};

exports.signUp = async (req, res) => {
    console.log('req', req.body);

        // Buat pengguna baru
        const newUser = new User({
            email,
            password,
            role: role || 'User', // Atur default role jika tidak diberikan
        });

        // Simpan pengguna ke database
        await newUser.save();

        // Berikan token
        res.status(201).json({
            _id: newUser._id,
            role: newUser.role,
            email: newUser.email,
            token: generateToken(newUser._id),
        });
    
};

exports.signUpGoogle = async (req, res) => {
  const { token } = req.body;
    try {
        // Verifikasi token Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GMAIL_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        // Cari pengguna di database atau buat pengguna baru
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                name,
                email,
                googleAuth: true, // Tandai akun sebagai akun Google
                isRegistered: true
            });
            await user.save();
        }

        res.status(200).json({ message: 'Google Sign-In Successful', user });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid Google Token' });
    }
};

exports.sendEmail = async (req, res, next) => {
  const {email} = req.body;
  const formatedEmail = email.toLowerCase();
  const user = await User.findOne({email: formatedEmail});
  if (!user) {
      return res.status(401).json({message: 'User not registered'});
  }
  if(user.otp.otp){
    const dateNow = new Date().getTime  ;
    const userDate = new Date(user.otp.sendTime).getTime();
    if(userDate > dateNow){
      return res.status(400).json({ message: `Please wait until ${new Date(
          user.otp.sendTime
        ).toLocaleTimeString()}` });
    }
  }

  const otp = Math.floor(Math.random()*9000)+1000;
  console.log(otp);
  const token = crypto.randomBytes(32).toString('hex');

  user.otp.otp = otp;
  user.otp.sendTime = new Date().getTime() +1*60*1000;
  user.otp.token = token;

  await user.save(); 
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
    from:'Keripik Mantul <process.env.GMAIL>',
    to: formatedEmail,
    subject: 'Reset Password - Keripik Mantul',
    text: 
    `Halo ${user.email},
    Kami menerima permintaan untuk mereset password akun Anda di Keripik Mantul. Jika Anda yang membuat permintaan ini, silakan gunakan kode OTP berikut untuk melanjutkan proses reset password Anda:
    
    🔑 Kode OTP: ${otp}

    Jika Anda tidak melakukan permintaan ini, abaikan email ini dan pastikan akun Anda aman. Jika Anda membutuhkan bantuan lebih lanjut, hubungi kami di ${process.env.GMAIL}.

Terima kasih telah mempercayai Keripik Mantul!
Salam hangat,
Tim Keripik Mantul`
  };
  
  await transporter.sendMail(mailOptions);
  res.status(200).json({ message: 'OTP sent to your email',token});
};

exports.verifyOtp = async (req, res, next) => {
  const { otp } = req.body;

  const findedUser = await User.findOne({ "otp.otp": otp });
  console.log("FindedUser: "+findedUser);
  if (!findedUser) {
    return res.status(400).json({ message: "Invalid OTP!"});
  }
  if (new Date(findedUser.otp.sendTime).getTime() < new Date().getTime()) {
    return res.status(400).json({ message: "OTP expired!"});
  }

  findedUser.otp.otp = null;
  findedUser.isRegistered = true;
  await findedUser.save();
  return res.status(200).json({ message: "OTP verified", token: findedUser.otp.token}); 
};

exports.getOtpTime = async (req, res, next) => { 
  const { token } = req.body;
  const findedUser = await User.findOne({ "otp.token": token }).select(
    "otp"
  );

  if (!findedUser) {
    return res.status(400).json({ message: "Something went wrong"});
  }
  return res.status(200).json({
    message: "Success",
    sendTime: findedUser.otp.sendTime,
  });
};

exports.changePassword = async (req,res) => {
  const { token,password,confirmPassword } = req.body;
  const user = await User.findOne({ "otp.token": token });
  if(!user){
    return res.status(400).json({ message: "User not registered" });
  }
  
  if(password !== confirmPassword){
    return res.status(400).json({ message: "Password did not match!" });
  }

  user.password = password;
  user.otp.token = null;

  await user.save();
  return res.status(200).json({ message: "Password changed successfully!" })
};