import React, {useState, useEffect} from "react";
import { Card, Col, Row, Button, Typography, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { FaRegHeart, FaAngleRight } from "react-icons/fa"
import axios from "axios";
import { URL_KATEGORI } from "../utils/Endpoint";
import { Link } from "react-router-dom";
import jumbotron_produk from "../assets/jumbotron_produk.jpg";
import balung from "../assets/k-balung-kuwuk.jpg";
import pisang from "../assets/k-pisang.jpg";
import talas from "../assets/k-talas.jpg";
import singkong from "../assets/k-singkong.jpg";
import keripik3 from "../assets/3-keripik.jpg";
import '../style.css';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ProductsKategori = () => {
    const [kategoris, setKategoris] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch data produk saat load page
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [kategoriResponse] = await Promise.all([
                    axios.get(URL_KATEGORI)
                ]);

                setKategoris(kategoriResponse.data);
            } catch (err) {
                message.error("Gagal memuat data!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fn -> add to cart
    const HandleAddToCart = (product) => {
        message.success(`${product.title} added to cart!`);
    };

    return (
        <div style={{ padding: '0', position:'relative' }}>
            <div style={{width: '100%', height: '55vh', padding: '0', position: 'relative', backgroundColor: 'transparent'}}>
                <img src={jumbotron_produk} alt="" draggable='false' style={{zIndex:'0', position: 'absolute'}}/>
            </div>
            <div className="py-5 bg-white relative" style={{zIndex: '5', borderRadius: '80px 80px 0 0'}}>
                <div className="flex text-center w-full justify-evenly pb-5 text-2xl" style={{borderBottom:"2px solid #7B281D"}}>
                    <Link to="/products" className={`text-[#7B281D] hover:text-red-600 font-bold ${
                location.pathname === "/products" ? "border-b-2 border-red-800" : ""
              }`}>Produk</Link>
                    <Link to="/products/kategori" className={`text-[#7B281D] hover:text-red-600 font-bold ${
                location.pathname === "/products/kategori" ? "border-b-2 border-red-800" : ""
              }`}>Kategori</Link>
                </div>
                <div className="bg-white pt-10 px-52">
                        {kategoris.map((data) => (
                            <div className="flex flex-col" key={data._id} onClick={() => navigate(`/products/kategori/${data._id}`)}>
                                <div className="border border-black px-7 py-3 my-1 font-semibold w-full rounded-md flex justify-between hover:bg-gray-100 hover:border-gray-500 cursor-pointer"> 
                                <p>{data.nama_kategori}</p>
                                <FaAngleRight className="mt-1"/>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsKategori;