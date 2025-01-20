import React, {useState, useEffect} from "react";
import { Card, Col, Row, Button, Typography, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
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
            <div className="py-9 px-10 bg-white relative" style={{zIndex: '5', borderRadius: '80px 80px 0 0'}}>
                <section id="product-list" className="mb-11">
                    <Title level={2}>Produk Terlaris</Title>
                    <div className="bg-[#F2E8C6] p-5">
                        <Row gutter={[13, 13]}>
                            {productsTerlaris.slice(0, 4).map((product) => (
                                <Col span={6} key={product.id}>
                                    <Card
                                        style={{
                                            height: '436px',
                                            minHeight: '436px',
                                        }}
                                        hoverable
                                        cover={
                                            <img alt={product.name} src={product.thumbnail} style={{
                                                maxHeight: '250px',
                                                overflowY: 'hidden',
                                                marginBottom: 'auto'
                                            }}/>
                                        }>
                                        <Card.Meta
                                            style={{
                                                marginTop: 'auto'
                                            }}
                                            title={product.name}
                                            description={`Rp ${product.price}`}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<ShoppingCartOutlined />}
                                            style={{ marginTop: "10px" }}
                                            // onClick={() => handleAddToCart(product)}
                                        >
                                        <Link to={`/checkout/${product._id}`}>Checkout Now</Link>
                                        </Button>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>
                <section className="mb-11">
                    <Title level={2}>Direkomendasikan</Title>
                    <div className="bg-[#F2E8C6] p-5">
                        <Row gutter={[13, 13]}>
                            {productsTerlaris.slice(0, 4).map((product) => (
                                <Col span={6} key={product.id}>
                                    <Card
                                        style={{
                                            height: '436px',
                                            minHeight: '436px',
                                        }}
                                        hoverable
                                        cover={
                                            <img alt={product.name} src={product.thumbnail} style={{
                                                maxHeight: '250px',
                                                overflowY: 'hidden',
                                                marginBottom: 'auto'
                                            }}/>
                                        }>
                                        <Card.Meta
                                            style={{
                                                marginTop: 'auto'
                                            }}
                                            title={product.name}
                                            description={`Rp ${product.price}`}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<ShoppingCartOutlined />}
                                            style={{ marginTop: "10px" }}
                                            // onClick={() => handleAddToCart(product)}
                                        >
                                        <Link to={`/checkout/${product._id}`}>Checkout Now</Link>
                                        </Button>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>
                <div className="px-4">
                    <div className="relative" style={{height: '500px', width: '100%'}}>
                        <img src={keripik3} alt="" className="absolute" style={{
                            width: '744px',
                            height: '441px',
                            borderRadius: '20px 100px 20px 100px',
                        }}/>
                        <div className="absolute bottom-1 right-0 transform text-left bg-[#F2E8C6] border-2 border-[#800000]" style={{
                            width: '614px',
                            height: '440px',
                            borderRadius: '100px 100px 100px 0px',
                            padding: '50px 0px 50px 150px',
                        }}>
                            <p className="calistoga-regular mb-4" style={{color: 'black', fontSize: '2.5rem', lineHeight: 1.2}}>
                                Sensasi <span style={{
                                    color: '#800000'
                                }}>kriuk</span> <br />
                                yang <span style={{
                                    color: '#800000'
                                }}>luar biasa.</span>
                            </p>
                            <p style={{color: 'black', fontSize: '1.1rem', lineHeight: 1.2}}>
                                Nikmati keripik singkong, talas, dan <br />
                                pisang dengan rasa yang menggoda <br />
                                dan kualitas terbaik. Setiap gigitan <br />
                                memberikan kenikmatan yang tak <br />
                                terlupakan!
                            </p>
                            <Link to="#" onClick={() => {
                                const targetElement = document.getElementById('product-list');
                                if (targetElement) {
                                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}>
                                <Button
                                    type="secondary"
                                    className="border-0 border-red-800 hover:border-red-600 hover:text-red-700 mt-20"
                                    style={{
                                        backgroundColor: '#800000',
                                        color: 'white',
                                        borderRadius: '20px',
                                        padding: '0px 15px 3px 15px',
                                        height: '45px',
                                        fontSize: '1.2rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    Beli Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeProduct;