import React, { useState, useEffect } from "react";
import { Image, message, Button } from "antd";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import axios from "axios";
import { URL_PRODUCT, URL_KATEGORI } from "../utils/Endpoint";
import { useNavigate, useParams } from "react-router-dom";

const DetailProduct = () => {
    const [Products, setProducts] = useState({});
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const { id } = params;

    // Fetch data produk saat load page
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
        const fullStars = Math.floor(rating); // Hitung jumlah bintang penuh
        const hasHalfStar = rating % 1 !== 0; // Cek apakah ada bintang setengah

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

    return (
        <div>
            <div className="flex bg-[#F2E8C6] p-3 py-5">
                <button onClick={handleBack} className="text-4xl text-red-800 me-4 ms-3">
                    <IoArrowBackCircleOutline />
                </button>
                <div className="text-center w-full">
                    <h1 className="text-2xl font-semibold">Detail Product</h1>
                    <h4>Temukan informasi lengkap tentang produk pilihan Anda di sini</h4>
                </div>
            </div>

            <div className="px-28 mt-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-10 mb-5">
                    <div className="w-auto">
                        <Image
                            src={Products.thumbnail}
                            style={{ height: "50vh", objectFit: "cover" }}
                            alt="Foto produk"
                            loading="lazy"
                            className="border p-3 rounded-md border-red-700"
                        />
                    </div>
                    <div className="py-5">
                        <h1 className="text-xl font-medium">{Products.name}</h1>
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold">{Products.rating || "4.3"}</span>
                            <div className="flex">{renderStars(Products.rating || 4.3)}</div>
                            <span className="text-gray-500">{Products.reviews || "100 Ulasan"}</span>
                        </div>
                        <h1 className="text-base font-medium">2,9RB terjual</h1>
                        <h1 className="text-2xl font-medium mt-7">Rp {Products.price?.toLocaleString('id-ID')}</h1>
                        <div className="flex mt-16 pe-28">
                            <Button
                                type="secondary"
                                className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl w-full h-6 py-4 justify-items-center text-base"
                            >
                                <span className="mb-1">Tambah Ke Keranjang</span>
                            </Button>
                            <Button
                                type="secondary"
                                className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl w-full h-6 py-4 justify-items-center ms-5 text-base"
                            >
                                <span className="mb-1">Beli Sekarang</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="">
                <h1 className="text-base font-medium mb-5">Deskripsi</h1>
                <textarea 
                    style={{
                        width: '100%',
                        height: '90%',
                        resize: 'none', // Opsional: untuk mencegah textarea diubah ukurannya
                        boxSizing: 'border-box',
                        backgroundColor: 'white'
                    }}
                    value={Products.description}
                    readOnly
                    disabled
                />
                </div>
            </div>
        </div>
    );
};

export default DetailProduct;
