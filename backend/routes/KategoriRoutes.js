const express = require('express');
const {
    getKategori,
    createKategori,
    deleteKategori,
    updateKategori,
} = require("../controllers/KategoriController");

const router = express.Router();

router.get("/", getKategori);
router.delete("/:id", deleteKategori);
router.patch("/:id", updateKategori);
router.post("/", createKategori);    

module.exports = router;