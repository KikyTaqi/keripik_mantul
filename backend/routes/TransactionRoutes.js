const express = require('express');
const { 
    getOrders,
    createTransaction,
    getProducts,
    findProducts,
    updateStatus,
    getTransaction,
    getDetailTransaction,
    getProductSales,
    changeStatus,
    Update,
    // handleMidtransNotification,
} = require("../controllers/TransactionController");

const router = express.Router();
router.get("/", getOrders);
router.get('/:id', getDetailTransaction);
router.post("/checkout", createTransaction);
router.post('/products', getProducts);
router.post('/products/get', findProducts);
router.post('/status/:id', changeStatus);
router.post('/checkout/status', updateStatus);
router.put('/status/:id', Update);
router.get('/checkout/get/:id', getTransaction);
router.get('/checkout/product/get/:id', getProductSales);
// router.post("/midtrans/notification", handleMidtransNotification);

module.exports = router;