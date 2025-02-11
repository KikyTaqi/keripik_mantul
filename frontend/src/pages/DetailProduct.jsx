import React, { useState, useEffect } from "react";
import { Image, message, Button, Col, Row, Pagination, Skeleton, Modal, Rate, Input } from "antd";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import axios from "axios";
import { URL_PRODUCT, URL_TRANSACTION, URL_ULASAN, URL_USER } from "../utils/Endpoint";
import { useNavigate, useParams, Link } from "react-router-dom";
import '../style.css';
import { jwtDecode } from "jwt-decode";

const DetailProduct = () => {
    const [Products, setProducts] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [ulasan, setUlasan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 4; // Jumlah ulasan per halaman
    const [userId, setUserId] = useState("");
    const [cartItems, setCartItems] = useState([]);

    const params = useParams();
    const navigate = useNavigate();
    const { id } = params;
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

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
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUlasan = async () => {
            try {
                const response = await axios.get(`${URL_ULASAN}/${id}`);
                console.log("Ulasan dari API:", response.data); // Debugging
    
                if (Array.isArray(response.data)) {
                    setUlasan(response.data);
                } else {
                    setUlasan([]); // Pastikan tetap array kosong jika respons bukan array
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
    
        if (id) {
            console.log("Fetching ulasan untuk produk:", id); // Debugging
            fetchUlasan();
        }
    }, [id, ulasan.length]);

    const handleToCheckout = async (id) => {
        if (id != null) {
            try {
                let data = {
                    productId: id,
                }
                const productResponse = await axios.post(`${URL_TRANSACTION}/products`, data);
                // setProducts(productResponse.data);
                localStorage.setItem('cartItems', productResponse.data);
                navigate(`/products/checkout/`);
            } catch (err) {
                console.error(err);
                message.error(err)
            }
        }
    }

    const handleSubmitReview = async () => {
        if (!rating || !comment) {
            message.error("Harap isi rating dan komentar!");
            return;
        }
    
        try {
            const token = localStorage.getItem("userToken");
            const decoded = jwtDecode(token);
    
            console.log("Mengirim ulasan untuk produk:", id);
    
            const response = await axios.post(`${URL_ULASAN}/${id}/ulasan`, {
                userId: decoded._id,
                username: decoded.name,
                rating,
                comment,
            });
            
            console.log("bakankdnajkak: " + decoded.name);
            
            console.log("Response dari server:", response.data);
    
            message.success("Ulasan berhasil ditambahkan!");
    
            // Tutup modal
            setIsModalOpen(false);
    
            // Reset input
            setRating(0);
            setComment("");
    
            // Tambahkan ulasan baru ke awal array
            setUlasan((prevUlasan) => [response.data, ...prevUlasan]);
    
        } catch (error) {
            console.error("Gagal menambahkan ulasan:", error.response?.data || error.message);
            message.error("Terjadi kesalahan saat menambahkan ulasan.");
        }
    };
    
      
    

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
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const handleAddToCart = async (product) => {
        if (!userId) {
            message.error("Silakan login terlebih dahulu!");
            return;
        }

        const isInCart = cartItems.some(
            (item) => item.productId === product._id
        );
        console.log(isInCart);
        // Debugging untuk memastikan kondisi ini bekerja dengan benar

        await addToCart(product);

        // Refresh cart setelah menambahkan atau menghapus item
        const updatedCart = await axios.get(`${URL_CART}/${userId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("ID", id);
                const productResponse = await axios.patch(`${URL_PRODUCT}/${id}`);
                setProducts(productResponse.data);
            } catch (err) {
                message.error("Gagal memuat data!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    // Function untuk menampilkan rating bintang
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else if (hasHalfStar && i === fullStars + 1) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-400" />);
            }
        }
        return stars;
    };

    const maskUsername = (username) => {
        if (!username || username.length < 2) return username; // Jika hanya 1 huruf, tidak diubah
        return username[0] + "*".repeat(username.length - 2) + username.slice(-1);
    };

    // Hitung indeks awal dan akhir untuk slicing data ulasan
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = Array.isArray(ulasan) ? ulasan.slice(indexOfFirstReview, indexOfLastReview) : [];

    return (
        <div>
            <div className="flex bg-[#F2E8C6] p-3 py-5">
                <button onClick={handleBack} className="text-4xl text-red-800 me-4 ms-3">
                    <IoArrowBackCircleOutline />
                </button>
                <div className="text-center w-full">
                    <h1 className="text-2xl font-semibold">Detail Produk</h1>
                    <h4>Temukan informasi lengkap tentang produk pilihan Anda di sini</h4>
                </div>
            </div>

            <div className="px-28 mt-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-10 mb-5">
                    <div className="w-auto">
                        {loading ? (
                            <Skeleton.Image style={{ width: "30vw", height: "50vh" }} />
                        )
                            :
                            (
                                <Image
                                    src={Products.thumbnail}
                                    style={{ height: "50vh", maxWidth: '30vw', objectFit: "cover" }}
                                    alt="Foto produk"
                                    loading="lazy"
                                    className="border p-3 rounded-md border-red-700"
                                />
                            )
                        }
                    </div>
                    <div className="py-5">
                        {loading ? (
                            <>
                                <Skeleton.Input style={{ width: 200 }} active />
                                <div className="mt-2 flex space-x-2">
                                    <Skeleton.Input style={{ width: 50 }} active />
                                </div>
                                <Skeleton.Input style={{ width: 120 }} active className="mt-3" />
                            </>
                        )
                            :
                            (
                                <>
                                    <h1 className="text-xl font-medium">{Products.name}</h1>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg font-semibold">{Products.rating || "4.3"}</span>
                                        <div className="flex">{renderStars(Products.rating || 4.8)}</div>
                                        <span className="text-gray-500">{Products.reviews?.length || "100 Ulasan"}</span>
                                    </div>
                                    <h1 className="text-base font-medium">2,9RB terjual</h1>
                                    <h1 className="text-2xl font-medium mt-7">Rp {Products.price?.toLocaleString('id-ID')}</h1>
                                    <div className="flex mt-16 pe-28">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(Products);
                                            }}
                                            type="secondary"
                                            className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl w-full h-6 py-4 justify-items-center text-base"
                                        >
                                            <span className="mb-1">Tambah Ke Keranjang</span>
                                        </Button>
                                        <Button
                                            type="secondary"
                                            className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl w-full h-6 py-4 justify-items-center ms-5 text-base"
                                            onClick={() => { handleToCheckout(Products._id) }}
                                        >
                                            <span className="mb-1">Beli Sekarang</span>
                                        </Button>
                                    </div>
                                </>
                            )
                        }


                    </div>
                </div>

                <hr />

                <div className="my-5">
                    <h1 className="text-lg font-medium mb-5">Deskripsi</h1>
                    {loading ? (
                        <Skeleton paragraph={{ rows: 6 }} active />
                    ) : (
                        <textarea
                            style={{
                                width: '100%',
                                minHeight: "70vh",
                                resize: 'none',
                                boxSizing: 'border-box',
                                backgroundColor: 'white'
                            }}
                            value={Products.description}
                            readOnly
                            disabled
                        />
                    )}
                </div>

                <hr />

                {/* Ulasan Produk */}
                <Button
                    type="primary"
                    className="bg-red-800 text-white rounded-3xl px-4 py-2 mb-4"
                    onClick={showModal}
                >
                    Tambah Ulasan
                </Button>

                <Modal
                    title="Tambah Ulasan"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Batal
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleSubmitReview}>
                            Kirim Ulasan
                        </Button>,
                    ]}
                >
                    <div className="mb-3">
                        <h4 className="font-medium">Rating:</h4>
                        <Rate allowHalf value={rating} onChange={setRating} />
                    </div>
                    <div className="mb-3">
                        <h4 className="font-medium">Komentar:</h4>
                        <Input.TextArea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tulis ulasan Anda di sini..."
                        />
                    </div>
                </Modal>
                <div className="my-5">
                    <h1 className="text-lg font-medium mb-5">Ulasan Produk</h1>
                    <Row>
                        {loading ? (
                            [...Array(4)].map((_, index) => (
                                <Col key={index} className="mb-3" span={24}>
                                    <Skeleton active avatar />
                                </Col>
                            ))
                        ) : (
                            currentReviews.map((review, index) => (
                                <Col key={index} className="mb-3" span={24}>
                                    <div className="bg-[#F2E8C6] rounded-md px-4 py-2">
                                        <h1 className="font-medium text-base mb-1">{maskUsername(review.username)}</h1>
                                        <div className="flex mb-1">{renderStars(review.rating)}</div>
                                        <p className="text-gray-500 mb-1">{review.date
                                                ? new Date(review.date).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                                : "(Tanggal lahir tidak tersedia)"}</p>
                                        <p>{review.comment}</p>
                                    </div>
                                </Col>
                            ))
                        )}

                    </Row>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        <Pagination
                            current={currentPage}
                            total={ulasan.length}
                            pageSize={reviewsPerPage}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                            className='custom-pagination'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailProduct;
