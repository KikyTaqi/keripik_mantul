const express = require('express');
const router = express.Router();
const { signIn } = require("../controllers/AuthController");

router.post('/signin', signIn);

module.exports = router;