require("./models/Product");
require("./models/Transaction");
const mongoose = require("mongoose");
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const userRoutes = require('./routes/UserRoutes');
const productsRoutes = require('./routes/ProductRoutes');
const FileRoutes = require('./routes/FileRoutes');
const authRoutes = require('./routes/AuthRoutes')
const TransactionRoutes = require('./routes/TransactionRoutes')
const kategoriRoutes = require('./routes/KategoriRoutes')
const ongkirRoutes = require('./routes/OngkirRoutes')
const CartRoutes = require('./routes/CartRoutes')
const AlamatRoutes = require('./routes/AlamatRoutes')
const ulasanRoutes = require('./routes/UlasanRoutes');
app.use('/api/users', userRoutes);
app.use('/api/products', productsRoutes)
app.use('/api/files', FileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', TransactionRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/ongkir', ongkirRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/alamat', AlamatRoutes);
app.use("/api/ulasan", ulasanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
