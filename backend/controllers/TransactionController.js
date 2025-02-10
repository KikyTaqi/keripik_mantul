const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const midtransClient = require("midtrans-client");
const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET;

exports.createTransaction = async (req, res) => {
    try {
        const { first_name, amount, product_id } = req.body;
        let snap = new midtransClient.snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVERKEY,
        });

        const order_id = "ORDER-" + new Date().getTime()

        const parameter = {
            transaction_detail: {
                order_id: order_id,
                gross_amount: amount,
            },
            credit_card: {
                secure: true,
            },
            customer_detail: {
                first_name : first_name,
            },
        };

        const transaction = await snap.createTransaction(parameter);

        const transactionUrl = transaction.redirect_url;

        const newTransaction = new Transaction({
            ...req.body,
            midtrans_url: transactionUrl,
            transaction_id: order_id
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getProducts = async (req, res) => {
    try {
        console.log("IDDDPRODUK: "+req.body.productId);
        const products = await Product.findOne({ "_id": req.body.productId });
        
        console.log("PRODUKKKKKKKKKKKKKK: "+products.name);
        const productPayload = {
            _id: products._id,
            name: products.name,
        }
        console.log("PRODUKKKKPAYLOADaddaad: "+JSON.stringify(productPayload));
    
        const cartItems = jwt.sign(productPayload, secretkey, { expiresIn: '1h' });
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};
exports.findProducts = async (req,res) => {
    const {id} = req.body;

    try{
        const product = await Product.findOne({ _id: id });
        console.log("disini: "+id);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}