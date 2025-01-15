const express = require('express');
const {
    getOngkir,
    getDetailOngkir,
    createOngkir,
    deleteOngkir,
    updateOngkir,
} = require("../controllers/KategoriController");

const router = express.Router();

router.get("/", getOngkir);
router.get("/:id", getDetailOngkir);
router.delete("/:id", deleteOngkir);
router.patch("/:id", updateOngkir);
router.post("/", createOngkir);    

module.exports = router;