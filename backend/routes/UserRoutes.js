const express = require('express');
const { 
    createUser,
    getUsers,
    getCustomers,
    getProfile,
} = require("../controllers/UserController");

const router = express.Router();

router.get("/", getUsers);
router.get("/customers", getCustomers);
router.post("/profile", getProfile);
router.post('/', createUser);

module.exports = router;