const express = require('express');
const router = express.Router();
const { signIn } = require("../controllers/AuthController");
const { signUp } = require("../controllers/AuthController");

router.post('/signin', signIn);
router.post('/signup', signUp);

module.exports = router;