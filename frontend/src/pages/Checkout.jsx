import React, {useEffect, useState} from "react";
import {
    Card,
    Button,
    Input,
    Form,
    Col,
    Row,
    Modal,
    Select,
    Tag,
} from "antd";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { RightOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL_PRODUCT, URL_TRANSACTION } from "../utils/Endpoint";
import { useNavigate, useParams, Link } from "react-router-dom";

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const [midtransUrl, setMidtransUrl] = useState("");
    const [form] = Form.useForm();
    const params = useParams();
    const { id } = params;
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        axios
            .get(`${URL_PRODUCT}/${id}`)
            .then((res) => {
                console.log("res", res.data);
                setProduct(res.data);
                setMidtransUrl(res.data.midtrans_url);
            })
            .catch((err) => {
                console.log("err", err.response);
            });
    }, []);

    const handleCheckout = (values) => {
        setLoading(true);
        console.log("Values", values);
        console.log("midtransurl", midtransUrl);
        
        const data = {
            first_name: values.first_name,
            amount: product.price,
        };
        axios
            .post(URL_TRANSACTION, data)
            .then((res) => {
                console.log("res", res.data);
                if (res.data.midtrans_url) {
                    window.location.href = res.data.midtrans_url;
                }
            })
            .catch((err) => {
                console.log('err', err);
            })
    };
    
    const modalAlamat = () => {
        setOpen(true);
    }

    const alamatList = [
        {
            id: 1,
            name: "Viola",
            phone: "+62 812-3456-7890",
            address: "Dusun Krajan RT.01/RW.06, Salamsari, Kec Boja, Kab Kendal, Jawa Tengah, ID, 51381",
            main: true,
        },
        {
            id: 2,
            name: "Viola (Vio)",
            phone: "+62 812-3456-7890",
            address: "Dusun Krajan RT.01/RW.06, Limbangan, Kec Limbangan, Kab Kendal, Jawa Tengah, ID, 51383",
        },
        {
            id: 3,
            name: "Daniel",
            phone: "+62 813-9876-5432",
            address: "Jl. Merdeka No.45, Kel. Banyumanik, Kec. Banyumanik, Semarang, Jawa Tengah, ID, 50263",
        },
        {
            id: 4,
            name: "Sinta",
            phone: "+62 852-4567-1234",
            address: "Jl. Diponegoro No.78, Kel. Candisari, Kec. Candisari, Semarang, Jawa Tengah, ID, 50252",
        },
        {
            id: 5,
            name: "Budi Santoso",
            phone: "+62 856-7890-4567",
            address: "Perumahan Griya Indah Blok A-12, Kel. Pedurungan, Kec. Pedurungan, Semarang, Jawa Tengah, ID, 50192",
        },
        {
            id: 6,
            name: "Rina Kusuma",
            phone: "+62 857-6543-7890",
            address: "Jl. Ahmad Yani No.99, Kel. Tlogosari, Kec. Tlogosari, Semarang, Jawa Tengah, ID, 50196",
        },
    ];
    
    const [selectedAlamat, setSelectedAlamat] = useState(null);

    useEffect(() => {
        const defaultAlamat = alamatList.find(alamat => alamat.main);
        if (defaultAlamat) {
            setSelectedAlamat(defaultAlamat.id);
        }
    }, []);

    

     // Cari alamat yang memiliki "main: true"
     const defaultAlamat = alamatList.find(alamat => alamat.main) || alamatList[0];
 
     // State untuk alamat yang sudah dikonfirmasi
     const [confirmedAlamat, setConfirmedAlamat] = useState(defaultAlamat.id);
 
     // Fungsi untuk menangani konfirmasi alamat
     const handleConfirmAlamat = () => {
         setConfirmedAlamat(selectedAlamat); // Simpan alamat yang dipilih
         setOpen(false); // Tutup modal
     };
 
     // Fungsi untuk menangani pembatalan pemilihan alamat
     const handleCancelAlamat = () => {
         setSelectedAlamat(confirmedAlamat); // Kembalikan ke alamat yang sudah dikonfirmasi
         setOpen(false); // Tutup modal
     };

    const [cart, setCart] = useState([
        { id: 1, name: "Keripik Singkong", price: 5000, quantity: 2 },
        { id: 2, name: "Keripik Tempe", price: 3000, quantity: 5 }
    ]);
    
    const [subtotal, setSubtotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0); // Biaya pengiriman
    const [total, setTotal] = useState(0);    

    useEffect(() => {
        const newSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setSubtotal(newSubtotal);
        setTotal(newSubtotal + shippingCost);
    }, [cart, shippingCost]);    

    return (
        <div>
            <div className="flex bg-[#F2E8C6] mb-3 p-3 py-5">
                <button onClick={handleBack} className="text-4xl text-red-800 me-4 ms-3">
                    <IoArrowBackCircleOutline />
                </button>
                <div className="text-center w-full">
                    <h1 className="text-2xl font-semibold">Checkout Produk</h1>
                    <h4>Periksa kembali pesanan Anda sebelum checkout</h4>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-x-3 px-4">
                <div className="col-span-2 rounded-md border border-stone-300 p-2">
                    <h1 className="font-bold text-base">Alamat Pengiriman</h1>
                    <div className="flex mt-3 cursor-pointer" onClick={modalAlamat}>
                        <LuMapPin className="text-4xl" />
                        <div className="flex justify-between mx-3 w-full">
                            <div className="font-medium">
                            <p>
                                {alamatList.find(alamat => alamat.id === confirmedAlamat)?.name} 
                                ({alamatList.find(alamat => alamat.id === confirmedAlamat)?.phone})
                            </p>
                            <p>{alamatList.find(alamat => alamat.id === confirmedAlamat)?.address}</p>
                            </div>
                            <RightOutlined className="text-lg" />
                        </div>
                    </div>
                    <hr className="my-3 border" />
                    <Row>
                        {cart.map((item) => (
                            <Col key={item.id} className="mb-3">
                                <div className="border border-stone-300 rounded-md grid grid-cols-4">
                                    <div className="">
                                        <img src={product?.thumbnail} alt="Produk" style={{ maxHeight: '30vh', maxWidth: '40vw', objectFit: 'cover' }} />
                                    </div>
                                    <div className="col-span-2 my-auto ms-4">
                                        <p className="text-base">{item.name}</p>
                                        <p>×{item.quantity}</p>
                                    </div>
                                    <div className="my-auto flex justify-end">
                                        <p className="font-semibold text-lg pe-10">
                                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <div className="my-2 ms-2 flex justify-between">
                        <h1 className="font-bold text-lg">Subtotal Produk</h1>
                        <p className="font-semibold text-lg pe-10">
                            Rp {subtotal.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className="border border-stone-300 rounded-md mb-3">
                        <div className="p-1 px-4">
                            <div className="text-center py-2">
                                <h1 className="font-bold text-lg text-red-800">
                                    Ringkasan Pesanan
                                </h1>
                            </div>
                            <hr className="border mb-2" />
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <p className="text-base font-normal">Subtotal</p>
                                </div>
                                <div className="">
                                    <p className="text-base font-normal">Rp {subtotal.toLocaleString("id-ID")}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <p className="text-base font-normal">Subtotal Pengiriman</p>
                                </div>
                                <div className="">
                                    <p className="text-base font-normal">Rp 0</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#F2E8C6] mt-6 p-3">
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <p className="text-base font-semibold">Total</p>
                                </div>
                                <div className="">
                                    <p className="text-base font-semibold">Rp {total.toLocaleString("id-ID")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                        <Button
                            type="secondary"
                            className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl w-full h-6 py-5 justify-items-center text-base"
                        >
                            <span className="mb-1">Buat Pesanan</span>
                        </Button>
                </div>
            </div>


            <Modal
                title={<p>Alamat Tersimpan</p>}
                footer={
                    <div className="grid grid-cols-4 gap-3">
                        <div className="col-end-5">
                            <Button
                                type="secondary"
                                className="bg-white text-red-800 border-3 border-red-800 font-semibold rounded-3xl w-full h-6 py-5 text-base"
                                onClick={handleCancelAlamat}
                            >
                                <span className="mb-1">Batal</span>
                            </Button>
                        </div>
                        <div className="col-end-6">
                            <Button
                                type="secondary"
                                className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl w-full h-6 py-5 text-base"
                                onClick={handleConfirmAlamat}
                            >
                                <span className="mb-1">Konfirmasi</span>
                            </Button>
                        </div>
                    </div>
                }
                open={open}
                closable={false}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}
                styles={{
                    body:{
                        maxHeight: "50vh",
                        overflowY: "auto"   
                    }
                }}
            >
                <div className="p-3 py-5">
                    {alamatList.map((alamat) => (
                        <div 
                            key={alamat.id} 
                            className={`rounded-lg p-3 border ${
                                selectedAlamat === alamat.id ? "border-red-800" : "border-stone-300"
                            } grid grid-cols-5 mb-2 cursor-pointer`}
                            onClick={() => setSelectedAlamat(alamat.id)}
                        >
                            <div className="col-span-4">
                                <div className="grid grid-cols-[auto_1fr] divide-x divide-gray-400 gap-3">
                                    <div className="text-base font-semibold">
                                        <h1>{alamat.name}</h1>
                                    </div>
                                    <div className="text-gray-400 ps-3 text-base font-medium">
                                        <p>({alamat.phone})</p>
                                    </div>
                                </div>
                                <p>{alamat.address}</p>
                                {alamat.main === true ? (<Tag className="border border-red-800 text-red-800 bg-white mt-2">Utama</Tag>) : ("")}
                            </div>
                            <div className="flex justify-center items-center">
                                <input 
                                    type="radio" 
                                    checked={selectedAlamat === alamat.id} 
                                    onChange={() => setSelectedAlamat(alamat.id)}
                                    className="w-5 h-5 cursor-pointer accent-red-800"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default Checkout;