import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, Typography, message, Skeleton, Pagination } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { URL_PRODUCT, URL_USER, URL_CART } from "../utils/Endpoint";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import jumbotron_produk from "../assets/jumbotron_produk.jpg";
import "../style.css";

const { Title } = Typography;

const HomeProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState("");
  const pageSize = 25;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("userToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const profileResponse = await axios.post(`${URL_USER}/profile`, {
          email: decoded.email,
        });

        const userId = profileResponse.data[0]._id;
        setUserId(userId);
        const [productResponse, cartResponse] = await Promise.all([
          axios.get(URL_PRODUCT),
          axios.get(`${URL_CART}/${userId}`)
        ]);
        setCartItems(cartResponse.data.items || []);
        const response = await axios.get(URL_PRODUCT);
        setProducts(response.data);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ padding: "0", position: "relative" }}>
      <div style={{ width: '100%', height: '55vh', padding: '0', position: 'relative', backgroundColor: 'transparent' }}>
        <img src={jumbotron_produk} alt="" draggable='false' style={{ zIndex: '0', position: 'absolute' }} />
      </div>
      <div className="py-5 bg-white relative" style={{ zIndex: '5', borderRadius: '80px 80px 0 0' }}>
        <div className="flex text-center w-full justify-evenly pb-5 text-2xl" style={{ borderBottom: "2px solid #7B281D" }}>
          <Link to="/products" className={`text-[#7B281D] hover:text-red-600 font-bold ${location.pathname === "/products" ? "border-b-2 border-red-800" : ""
            }`}>Produk</Link>
          <Link to="/products/kategori" className={`text-[#7B281D] hover:text-red-600 font-bold ${location.pathname === "/products/kategori" ? "border-b-2 border-red-800" : ""
            }`}>Kategori</Link>
        </div>
        <div className="bg-white p-5">
          <Row gutter={[13, 13]}>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                <Col span={5} key={index} style={{ flex: "0 0 20%", maxWidth: "20%" }}>
                  <Card style={{ height: "436px", minHeight: "436px", padding: 10 }} hoverable>
                    <Skeleton.Image style={{ width: "13vw", height: "250px", marginBottom: "10px" }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))
              : paginatedProducts.map((product) => {
                const isInCart = Array.isArray(cartItems) && cartItems.some(items => items.productId === product._id);
                return (
                  <Col span={5} key={`${product._id}-${isInCart}`} style={{ flex: '0 0 20%', maxWidth: '20%' }}>
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
                            icon={isInCart ? <FaShoppingCart style={{ color: "red", fontSize: "20px" }} /> : <ShoppingCartOutlined style={{ fontSize: "23px" }} />}
                            className="border-none text-base hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                          />
                          <Button
                            type="secondary"
                            icon={<FaRegHeart style={{ fontSize: '20px' }} />}
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
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={products.length}
            onChange={handlePageChange}
            className="custom-pagination"
            style={{ textAlign: "center", marginTop: "20px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeProduct;