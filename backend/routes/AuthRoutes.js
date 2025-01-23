const express = require('express');
const router = express.Router();
const { signIn } = require("../controllers/AuthController");
const { signUp } = require("../controllers/AuthController");
const { sendEmail } = require("../controllers/AuthController");
const { verifyOtp } = require("../controllers/AuthController");
const { getOtpTime } = require("../controllers/AuthController");
const { changePassword } = require("../controllers/AuthController");
const { signUpGoogle } = require("../controllers/AuthController");
const { signInGoogle } = require("../controllers/AuthController");
const { confirmAccount } = require("../controllers/AuthController");
const { sendConfirmAccount } = require("../controllers/AuthController");

router.post('/signin', signIn);
router.post('/signin/google', signInGoogle);
router.post('/signup/confirm', confirmAccount);
router.post('/signup/confirm/send', sendConfirmAccount);
router.post('/signup/google', signUpGoogle);
router.post('/password/reset', sendEmail);
router.post('/password/reset/otp', verifyOtp); 
router.post('/password/reset/otp/time', getOtpTime); 
router.post('/password/new', changePassword);

module.exports = router;