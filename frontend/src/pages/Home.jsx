import React, {useState, useEffect} from "react";
import { Card, Col, Row, Button, Typography, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from "axios";
import { URL_PRODUCT } from "../utils/Endpoint";
import { Link } from "react-router-dom";
import jumbotron_home from "../assets/jumbotron_home.jpg";
// import jumbotron_home from "../assets/jumbotron_home.jpg";
import '../style.css';

const { Title } = Typography;

const Home = () => {
    const [products, setProducts] = useState([]);

    // Fetch data produk saat load page
    useEffect(() => {
        axios
            .get(URL_PRODUCT)
            .then((res) => {
                console.log("res", res.data);
                setProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
                message.error('Failed to fetch product');
            });
    }, []);

    // Fn -> add to cart
    const HandleAddToCart = (product) => {
        message.success(`${product.title} added to cart!`);
    };

    return (
        <div style={{ padding: '0' }}>
            <div style={{width: '100%', height: '100%', padding: '0', position: 'relative'}}>
                <div style={{position: 'absolute', top: '10rem', left: '15rem'}}>
                    <p className="calistoga-regular" style={{ color: 'black', fontSize: '2rem', lineHeight: 1.2}}>
                        Rasakan Kelezatan <br />
                        <span style={{color: '#800000'}}>Keripik Mantul !</span>
                    </p>
                    <p style={{ color: 'black', fontSize: '1.1rem', margin: '0', lineHeight: 1.2    }}>
                        Dibuat dari bahan berkualitas, <br />
                        Keripik Mantul memberikan pengalaman <br />
                        ngemil terbaik yang tak terlupakan.
                    </p>
                </div>
                <img src={jumbotron_home} alt="" />
            </div>
            <div className="p-5 flex justify-center flex-col">
                <Title level={2} style={{alignSelf: 'start'}}>Kategori</Title>
                <div className="px-6 py-8 bg-[#F2E8C6] flex justify-center" style={{borderRadius: '20px', width: 'fit-content', alignSelf: 'center'}}>
                    <div className="category-div mx-3 flex justify-center" style={{width: '450px', height: '450px'}}>
                        <Title level={3} className="text-center">Keripik Singkong</Title>
                        <img src="/" alt="" />
                    </div>
                    <div className="flex flex-col mx-3">
                        <div className="flex justify-between p-0" style={{gap: '20px', marginBottom: '19px'}}>
                            <div className="category-div" style={{width: '284px', height: '225px'}}>21ewjdqopid</div>
                            <div className="category-div" style={{width: '284px', height: '225px'}}>i09udoahwd</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="category-div" style={{width: '100%', height: '206px'}}>09u981y2r9h</div>
                        </div>
                    </div>
                </div>
            </div>
            <Title level={2}>Product List</Title>
            <Row gutter={[16, 16]}>
                {products.map((product) => (
                    <Col span={8} key={product.id}>
                        <Card
                            hoverable
                            cover={<img alt={product.name} src={product.thumbnail} />}>
                            <Card.Meta
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
    );
};

export default Home;