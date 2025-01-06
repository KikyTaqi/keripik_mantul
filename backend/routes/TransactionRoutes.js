const express = require('express');
const { createTransaction } = require("../controllers/TransactionController");

const router = express.Router();

router.post('/', createTransaction);

module.exports = router;