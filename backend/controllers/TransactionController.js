const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const Alamat = require("../models/Alamat");
const midtransClient = require("midtrans-client");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const secretkey = process.env.JWT_SECRET;

exports.getOrders = async (req,res) => {
    try{
        const orders = await Transaction.find({ status: { $ne: "pending" } }).sort({ _id: -1 }).populate({
            model: 'User',
            path: 'user_id'
        });
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}
exports.createTransaction = async (req, res) => {
    try {
        const { user_id, first_name, item_details, alamat_id, shipping_cost, gross_amount } = req.body;

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVERKEY,
        });

        const alamat = await Alamat.findOne({ "alamat._id": alamat_id });

        const order_id = "ORDER-" + new Date().getTime();
        const totalAmount = item_details.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const parameter = {
            transaction_details: {
              order_id,
              gross_amount: totalAmount + shipping_cost, // Tambahkan ongkir ke total harga
            },
            item_details: [
              ...item_details.map(item => ({
                id: item.id,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                name: item.name,
              })),
              {
                id: "SHIPPING",
                price: shipping_cost,  // Ongkir sebagai item tambahan
                quantity: 1,
                name: "Biaya Pengiriman",
              },
            ],
            customer_details: {
              first_name,
            //   address: {
            //     street: alamat.alamat[0].nama_jalan,
            //     city: alamat.alamat[0].kecamatan,
            //   },
            },
          };
          
        console.log("image: "+JSON.stringify(item_details))

        const transaction = await snap.createTransaction(parameter);
        const transactionUrl = transaction.redirect_url;

        const newTransaction = new Transaction({
            user_id,
            first_name: first_name,
            alamat_id: alamat_id,
            transaction_id: order_id,
            midtrans_url: transactionUrl,
            status: "pending",
            gross_amount: totalAmount,
            item_details: item_details,
        });

        await newTransaction.save();

        res.status(201).json({ midtrans_url: transactionUrl, transaction: transaction, order_id: order_id });
    } catch (err) {
        console.error("Error: "+err);
        res.status(500).json({ message: "Error creating transaction", error: err.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findOne({ "_id": req.body.productId });
        
        const productPayload = {
            _id: products._id,
            name: products.name,
        }
        // console.log("PRODUKKKKPAYLOADaddaad: "+JSON.stringify(productPayload));
    
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
        res.status(200).json(product);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.updateStatus = async (req,res) => {
    const {id, status} = req.body;
    // console.log("111111");
    // console.log("111111:: "+id);
    // console.log("1212122:: "+status);
    let statusTransaction = "pending";

    if(status === "success"){
        statusTransaction = "diproses";
    }else{
        return res.status(500).json({message: "Pembayaran gagal!"});
    }
    
    try{
        // console.log("222222");
        const order = await Transaction.findOne({transaction_id: id});
        // console.log("ORDER: "+JSON.stringify(order));
        
        order.status = statusTransaction;
        // console.log("333333");
        // console.log("ORDERSTATUS: "+order.status);
        order.save();
        // console.log("444444");
        res.status(200).json({message: `Pembayaran ${status}`});
    }catch(err){
        console.error(err.message);
        res.status(500).json({message: err.message});
    }
}

exports.getTransaction = async (req,res) => {
    const userId = req.params.id;

    try{
        const transaction = await Transaction.find({ user_id: userId });

        console.log("TESTRA: "+transaction.filter((item) => item.status === "diproses").flatMap((item) => item.item_details));
        const product = transaction.filter((item) => item.status === "diproses").flatMap((item) => item.item_details);
        const alamat = await Alamat.find();

        res.status(200).json(transaction);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}