import React, {useState, useEffect} from "react";
import { Card, Col, Row, Button, Typography, message, Skeleton } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { FaRegHeart } from "react-icons/fa"
import axios from "axios";
import { URL_PRODUCT } from "../utils/Endpoint";
import { Link } from "react-router-dom";
import jumbotron_produk from "../assets/jumbotron_produk.jpg";
import balung from "../assets/k-balung-kuwuk.jpg";
import pisang from "../assets/k-pisang.jpg";
import talas from "../assets/k-talas.jpg";
import singkong from "../assets/k-singkong.jpg";
import keripik3 from "../assets/3-keripik.jpg";
import '../style.css';

const { Title } = Typography;

const HomeProduct = () => {
    const [products, setProducts] = useState([]);
    const [productsTerlaris, setProductsTerlaris] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch data produk saat load page
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productResponse, productsResponse] = await Promise.all([
                    axios.get(URL_PRODUCT),
                    axios.get(URL_PRODUCT)
                ]);

                setProducts(productResponse.data);
                setProductsTerlaris(productsResponse.data);
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
                <div className="bg-white p-5">
                    <Row gutter={[13, 13]}>
                        {loading
                        ? Array.from({ length: 5 }).map((_, index) => ( // Placeholder Skeleton
                            <Col span={5} key={index} style={{flex: '0 0 20%', maxWidth: '20%'}}>
                            <Card
                                style={{
                                height: '436px',
                                minHeight: '436px',
                                padding: 10,
                                }}
                                hoverable
                            >
                                <Skeleton.Image style={{ width: '13vw', height: '250px', marginBottom: '10px'}} />
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </Card>
                            </Col>
                            ))
                        : productsTerlaris.map((product) => (
                            <Col span={5} key={product._id} style={{flex: '0 0 20%', maxWidth: '20%'}}>
                                <Card
                                    style={{
                                        height: '436px',
                                        minHeight: '436px',
                                        padding: 10,
                                    }}
                                    hoverable
                                    cover={
                                        <img alt={product.name} className="border border-[#F2E8C6] p-2" src={product.thumbnail} style={{
                                            minHeight: '250px',
                                            maxHeight: '250px',
                                            overflowY: 'hidden',
                                            marginBottom: 'auto',
                                            objectFit: 'cover',
                                        }}/>
                                    }>
                                    <Card.Meta
                                        style={{
                                            marginTop: 'auto',
                                            marginBottom: '3rem',
                                        }}
                                        title={product.category_id}
                                        description={`Rp ${product.price.toLocaleString('id-ID')}`}
                                    />
                                    
                                    <div className="flex justify-between items-center">
                                        <p>0 Terjual</p>
                                        
                                        <div className="flex flex-row-reverse">
                                        <Link to={`/checkout/${product._id}`}>
                                            <Button
                                                icon={<ShoppingCartOutlined />}
                                                className="bottom-0 ms-2 text-base border-none"
                                                // onClick={() => handleAddToCart(product)}
                                            >
                                            </Button>
                                        </Link>
                                        <Link to={`/`}>
                                            <Button
                                                icon={<FaRegHeart />}
                                                className="bottom-0 text-base border-none"
                                                // onClick={() => handleAddToCart(product)}
                                            >
                                            </Button>
                                        </Link>
                                        </div>
                                    </div>
                                    
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default HomeProduct;