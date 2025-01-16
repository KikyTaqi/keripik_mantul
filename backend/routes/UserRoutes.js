const express = require('express');
const { 
    createUser,
    getUsers,
    getCustomers
} = require("../controllers/UserController");

const router = express.Router();

router.get("/", getUsers);
router.get("/customers", getCustomers);
router.post('/', createUser);

module.exports = router;