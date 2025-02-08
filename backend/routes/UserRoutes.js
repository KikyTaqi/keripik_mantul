const express = require('express');
const multer = require('multer');
const { 
    createUser,
    getUsers,
    getCustomers,
    getProfile,
    editProfile,
    editProfilePassword,
} = require("../controllers/UserController");

const upload = multer({ dest: "uploads/products/", limits: { fileSize: 100 * 1024 * 1024 } });
const router = express.Router();

router.get("/", getUsers);
router.get("/customers", getCustomers);
router.post("/profile", getProfile);
router.post("/profile/edit", upload.single("image"), editProfile);
router.post("/profile/edit/password", editProfilePassword);
router.post('/', createUser);

module.exports = router;