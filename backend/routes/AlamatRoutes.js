const express = require("express");
const {
    getAlamat,
    addAlamat,
    removeAlamat,
    changePrimary,
} = require("../controllers/AlamatController");

const router = express.Router();

router.get("/:id", getAlamat);
router.post("/change", changePrimary);
router.post("/add", addAlamat);
router.post("/remove", removeAlamat);

module.exports = router;
