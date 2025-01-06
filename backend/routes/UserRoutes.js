const express = require('express');
const { createUser, getUsers } = require("../controllers/UserController");

const router = express.Router();

router.get("/", getUsers)
router.post('/', createUser);

module.exports = router;