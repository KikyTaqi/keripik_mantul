const express = require('express');
const { 
    createUser,
    getUsers,
    getCustomers,
    getProfile,
    editProfile,
    editProfilePassword,
} = require("../controllers/UserController");

const router = express.Router();

router.get("/", getUsers);
router.get("/customers", getCustomers);
router.post("/profile", getProfile);
router.post("/profile/edit", editProfile);
router.post("/profile/edit/password", editProfilePassword);
router.post('/', createUser);

module.exports = router;