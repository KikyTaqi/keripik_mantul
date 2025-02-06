import { useCart } from "../context/CartContext";
import React, {useState, useEffect} from "react";
import { Card, Col, Row, Button, Typography, message, Skeleton } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { URL_KATEGORI, URL_PRODUCT, URL_CART, URL_USER } from "../utils/Endpoint";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
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
    const [users, setUsers] = useState({});
    const [kategoris, setKategoris] = useState([]);
    const [productsTerlaris, setProductsTerlaris] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();

    // Fetch data produk saat load page
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Mengambil data profil dan produk secara bersamaan
                const token = localStorage.getItem("userToken");
                if (!token) return;
    
                const decoded = jwtDecode(token);
                const profileResponse = await axios.post(`${URL_USER}/profile`, {
                    email: decoded.email,
                });
    
                const userId = profileResponse.data[0]._id;
                setUserId(userId);
    
                // Mengambil data produk dan cart bersamaan
                const [productResponse, cartResponse] = await Promise.all([
                    axios.get(URL_PRODUCT),
                    axios.get(`${URL_CART}/${userId}`)
                ]);
                
                setProductsTerlaris(productResponse.data);  // Mengatur produk terlaris
                setCartItems(cartResponse.data.items || []);  // Mengatur cartItems
    
            } catch (err) {
                message.error("Gagal memuat data!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    
    const addToCart = async (productcart) => {
        try {
            const token = localStorage.getItem("userToken");
            const decoded = jwtDecode(token);
            const response = await axios.post(`${URL_CART}/add`, {
                userId: decoded._id,
                productId: productcart._id,
                name: productcart.name,
                price: productcart.price,
                thumbnail: productcart.thumbnail,
            });
            message.warning(`${productcart.name} berhasil ditambahkan ke keranjang!`);
            console.log("Add to Cart Response:", response.data);
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    
    
    const removeFromCart = async (product) => {
        try {
            const token = localStorage.getItem("userToken");
            const decoded = jwtDecode(token);
            const response = await axios.post(`${URL_CART}/remove`, {
                userId: decoded._id,
                productId: product._id,
            });
            setCartItems(response.data.items || []);  // Pastikan state diperbarui setelah penghapusan
            message.warning(`${product.name} dihapus dari keranjang!`);
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const handleAddToCart = async (product) => {
        if (!userId) {
            message.error("Silakan login terlebih dahulu!");
            console.log("blabala: " + userId);
            return;
        }
   
        const isInCart = cartItems.some(
            (item) => item.productId === product._id
        );
        console.log(isInCart);
         // Debugging untuk memastikan kondisi ini bekerja dengan benar
   
        if (isInCart) {
            await removeFromCart(product);
        } else {
            await addToCart(product);
        }
   
        // Refresh cart setelah menambahkan atau menghapus item
        const updatedCart = await axios.get(`${URL_CART}/${userId}`);
        setCartItems(updatedCart.data.items || []);
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
                        <div className="category-div mx-3 flex flex-col" style={{width: '450px', minHeight: '100'}} onClick={() => navigate(`/products/kategori/${kategoris._id = '67852eb856e587c20d175b5b'}`)}>
                            <Title level={2} className="text-center mt-5">Keripik Singkong</Title>
                            <img src={singkong} alt="" className="mt-9" style={{alignSelf: 'center', width:'364px', height: '275px'}}/>
                        </div>
                        <div className="flex flex-col mx-3">
                            <div className="flex justify-between p-0" style={{gap: '20px', marginBottom: '19px'}}>
                                <div className="category-div flex flex-col" style={{width: '284px', height: '225px'}} onClick={() => navigate(`/products/kategori/${kategoris._id = '6785c6534e50952ad679b8f3'}`)}>
                                    <Title level={2} className="text-center mt-5">Keripik Talas</Title>
                                    <img src={talas} alt="" className="" style={{alignSelf: 'center', width:'166px', height: '141px'}}/>
                                </div>
                                <div className="category-div flex flex-col" style={{width: '284px', height: '225px'}} onClick={() => navigate(`/products/kategori/${kategoris._id = '67889e81b1dd2d368622821c'}`)}>
                                    <Title level={2} className="text-center mt-5">Keripik Pisang</Title>
                                    <img src={pisang} alt="" className="" style={{alignSelf: 'center', width:'160px', height: '135px'}}/>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="category-div flex gap-5" style={{width: '100%', height: '206px'}} onClick={() => navigate(`/products/kategori/${kategoris._id = '67a024703b0840f608c6ae50'}`)}>
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
                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => ( // Placeholder Skeleton
                                <Col span={6} key={index}>
                                <Card
                                    style={{
                                    height: '436px',
                                    minHeight: '436px',
                                    padding: 10,
                                    }}
                                    hoverable
                                >
                                    <Skeleton.Image style={{ width: '16vw', height: '250px' }} />
                                    <Skeleton active paragraph={{ rows: 2 }} />
                                </Card>
                                </Col>
                            ))
                            : productsTerlaris.slice(0, 4).map((product) => {
                                const isInCart = Array.isArray(cartItems) && cartItems.some(items => items.productId === product._id);
                                return (
                                    <Col span={6} key={`${product._id}-${isInCart}`}>
                                        <Card
                                            style={{
                                                height: '436px',
                                                minHeight: '436px',
                                                padding: 10,
                                                }}
                                                hoverable
                                            onClick={() => {
                                                navigate(`/products/${product._id}`);
                                                window.scrollTo(0, 0);
                                            }}                                            
                                            cover={
                                                <img
                                                    alt={product.name}
                                                    className="border border-[#F2E8C6] p-2"
                                                    src={product.thumbnail}
                                                    style={{ minHeight: "250px", objectFit: "cover" }}
                                                />
                                            }
                                        >
                                            <Card.Meta
                                            style={{
                                                marginTop: 'auto',
                                                marginBottom: '3rem',
                                            }}
                                                title={product.name}
                                                description={`Rp ${product.price?.toLocaleString("id-ID")}`}
                                            />
                                            <div className="flex justify-between items-center">
                                                <p>0 Terjual</p>
                                                <div className="flex flex-row-reverse">
                                                <Button
                                                    type="secondary"
                                                    icon={isInCart ? <FaShoppingCart style={{ color: "red", fontSize: "20px" }} /> : <ShoppingCartOutlined style={{ fontSize: "23px" }}/>}
                                                    className="border-none text-base hover:text-red-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(product);
                                                    }}
                                                />
                                                <Button
                                                    type="secondary"
                                                    icon={<FaRegHeart style={{fontSize: '20px'}}/>}
                                                    className="bottom-0 border-none text-base hover:text-red-700"
                                                />
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })
                        }                                           
                        </Row>
                    </div>
                </section>
                <section id="product-list" className="mb-11">
                    <Title level={2}>Direkomendasikan</Title>
                    <div className="bg-[#F2E8C6] p-5">
                        <Row gutter={[13, 13]}>
                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => ( // Placeholder Skeleton
                                <Col span={6} key={index}>
                                <Card
                                    style={{
                                    height: '436px',
                                    minHeight: '436px',
                                    padding: 10,
                                    }}
                                    hoverable
                                >
                                    <Skeleton.Image style={{ width: '16vw', height: '250px' }} />
                                    <Skeleton active paragraph={{ rows: 2 }} />
                                </Card>
                                </Col>
                            ))
                            : productsTerlaris.slice(0, 4).map((product) => {
                                const isInCart = Array.isArray(cartItems) && cartItems.some(items => items.productId === product._id);
                                return (
                                    <Col span={6} key={`${product._id}-${isInCart}`}>
                                        <Card
                                            style={{
                                                height: '436px',
                                                minHeight: '436px',
                                                maxHeight: '436px',
                                                padding: 10,
                                                }}
                                                hoverable
                                            onClick={() => {
                                                navigate(`/products/${product._id}`);
                                                window.scrollTo(0, 0);
                                            }}                                            
                                            cover={
                                                <img
                                                    alt={product.name}
                                                    className="border border-[#F2E8C6] p-2"
                                                    src={product.thumbnail}
                                                    style={{ minHeight: "250px", objectFit: "cover" }}
                                                />
                                            }
                                        >
                                            <Card.Meta
                                            style={{
                                                marginTop: 'auto',
                                                marginBottom: '3rem',
                                            }}
                                                title={product.name}
                                                description={`Rp ${product.price?.toLocaleString("id-ID")}`}
                                            />
                                            <div className="flex justify-between items-center">
                                                <p>0 Terjual</p>
                                                <div className="flex flex-row-reverse">
                                                <Button
                                                    type="secondary"
                                                    icon={isInCart ? <FaShoppingCart style={{ color: "red", fontSize: "20px" }} /> : <ShoppingCartOutlined style={{ fontSize: "23px" }}/>}
                                                    className="border-none text-base hover:text-red-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(product);
                                                    }}
                                                />
                                                <Button
                                                    type="secondary"
                                                    icon={<FaRegHeart style={{fontSize: '20px'}}/>}
                                                    className="bottom-0 border-none text-base hover:text-red-700"
                                                />
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })
                        }      
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