const express = require('express');
const router = express.Router();
const { signIn } = require("../controllers/AuthController");
const { signUp } = require("../controllers/AuthController");
const { sendEmail } = require("../controllers/AuthController");

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/password/reset', sendEmail);
// router.post('/password/reset/code', resetCode);
// router.post('/password/new', passwordNew);

module.exports = router;