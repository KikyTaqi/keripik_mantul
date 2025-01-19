import React, {useState, useEffect} from "react";
import { Card, Col, Row, Button, Typography, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from "axios";
import { URL_PRODUCT } from "../utils/Endpoint";
import { Link } from "react-router-dom";
import jumbotron_home from "../assets/jumbotron_home.jpg";
import balung from "../assets/k-balung-kuwuk.jpg";
import pisang from "../assets/k-pisang.jpg";
import talas from "../assets/k-talas.jpg";
import singkong from "../assets/k-singkong.jpg";
import keripik3 from "../assets/3-keripik.jpg";
import '../style.css';

const { Title } = Typography;

const Home = () => {
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
        <div style={{ padding: '0' }}>
            <div style={{width: '100%', height: '100%', padding: '0', position: 'relative'}}>
                <div style={{position: 'absolute', top: '10rem', left: '15rem'}}>
                    <p className="calistoga-regular" style={{ color: 'black', margin: '0 0 12px 0', fontSize: '2rem', lineHeight: 1.2}}>
                        Rasakan Kelezatan <br />
                        <span style={{color: '#800000'}}>Keripik Mantul !</span>
                    </p>
                    <p style={{ color: 'black', fontSize: '1.1rem', margin: '0 0 20px 0', lineHeight: 1.2    }}>
                        Dibuat dari bahan berkualitas, <br />
                        Keripik Mantul memberikan pengalaman <br />
                        ngemil terbaik yang tak terlupakan.
                    </p>
                    <Link to="#" onClick={() => {
                        const targetElement = document.getElementById('product-list');
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}>
                        <Button
                            type="secondary"
                            className="border-0 border-red-800 hover:border-red-600 hover:text-red-700"
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
                <img src={jumbotron_home} alt="" draggable='false'/>
            </div>
            <div className="py-9 px-10">
                <div className="flex justify-center flex-col mb-11">
                    <Title level={2} style={{alignSelf: 'start'}}>Kategori</Title>
                    <div className="px-6 py-8 bg-[#F2E8C6] flex justify-center" style={{borderRadius: '20px', width: 'fit-content', alignSelf: 'center', minHeight: '100'}}>
                        <div className="category-div mx-3 flex flex-col" style={{width: '450px', minHeight: '100'}} >
                            <Title level={2} className="text-center mt-5">Keripik Singkong</Title>
                            <img src={singkong} alt="" className="mt-9" style={{alignSelf: 'center', width:'364px', height: '275px'}}/>
                        </div>
                        <div className="flex flex-col mx-3">
                            <div className="flex justify-between p-0" style={{gap: '20px', marginBottom: '19px'}}>
                                <div className="category-div flex flex-col" style={{width: '284px', height: '225px'}}>
                                    <Title level={2} className="text-center mt-5">Keripik Talas</Title>
                                    <img src={talas} alt="" className="" style={{alignSelf: 'center', width:'166px', height: '141px'}}/>
                                </div>
                                <div className="category-div flex flex-col" style={{width: '284px', height: '225px'}}>
                                    <Title level={2} className="text-center mt-5">Keripik Pisang</Title>
                                    <img src={pisang} alt="" className="" style={{alignSelf: 'center', width:'160px', height: '135px'}}/>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="category-div flex gap-5" style={{width: '100%', height: '206px'}}>
                                    <img src={balung} alt="" className="ms-9" style={{alignSelf: 'center', width:'154px', height: '180px'}}/>
                                    <Title level={2} className="text-center" style={{marginBottom: 'auto', marginTop:'auto'}}>Keripik Balung Kuwuk</Title>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default Home;