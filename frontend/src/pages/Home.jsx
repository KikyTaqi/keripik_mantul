import React, {useState, useEffect} from "react";
import { Card, Col, Row, Button, Typography, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from "axios";
import { URL_PRODUCT } from "../utils/Endpoint";
import { Link } from "react-router-dom";
import jumbotron_home from "../assets/jumbotron_home.jpg";
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
                    <p style={{ color: 'black', fontSize: '2rem'}}>
                        Rasakan Kelezatan <br />
                        <span style={{color: '#800000'}}>Keripik Mantul !</span>
                    </p>
                    <p style={{ color: 'black', fontSize: '1.1rem', margin: '0'}}>
                        Dibuat dari bahan berkualitas, <br />
                        Keripik Mantul memberikan pengalaman <br />
                        ngemil terbaik yang tak terlupakan.
                    </p>
                </div>
                <img src={jumbotron_home} alt="" />
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