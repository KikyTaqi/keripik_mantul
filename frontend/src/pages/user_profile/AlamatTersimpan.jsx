import React, { useState, useEffect } from "react";
import { Button, Image, ConfigProvider, message, Radio  } from 'antd';
import { HiPlusCircle } from "react-icons/hi2";
import axios from 'axios';
import { URL_USER, URL_ALAMAT } from '../../utils/Endpoint';
import { Link, useNavigate } from 'react-router-dom';
import '../../style.css';
import {jwtDecode} from "jwt-decode";

const AlamatTersimpan = () => {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [alamat, setAlamat] = useState([]);

    const handleSelectAddress = async (id) => {
        try{
            await axios.post(`${URL_ALAMAT}/change`, {
                userId,
                id: id,
            })
            message.success('Alamat utama berhasil diubah!');
            // navigate(0);
        } catch (error) {
            console.error("Error mengganti alamat utama", error);
        }
        setSelectedAddress(id);
    };

    const isSelected = (id, utama) => {
        if(selectedAddress == null){
            if(utama == true){
                return true;
            }
            return false;
        }else{
            if(id == selectedAddress){
                return true;
            }
            return false;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const decoded = jwtDecode(token); // Decode token untuk mendapatkan email
                const response = await axios.post(`${URL_USER}/profile`, { email: decoded.email });
                setUserId(response.data[0]._id);
                setUsers(response.data);

                axios.get(`${URL_ALAMAT}/${response.data[0]._id}`)
                .then(response => setAlamat(response.data.alamat || []))
                .catch(error => console.error("Error fetching cart:", error)); 
              } catch (error) {
                console.error("Error fetching profile");
                navigate("/signin");
              } finally {
                setLoading(false);
              }
        };

        fetchData();
    }, []);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#800000"
                },
                components: {
                    Table: {
                        headerBg: "#F2E8C6",
                        headerBorderRadius: 0,
                        borderColor: "#B9B9B9",
                    },
                },
            }}
        >
        {users.map((index) => (
            <>
                <div className="border p-2 border-[#F2E8C6]" key={index}>
                    <div className="bg-[#F2E8C6] rounded-md text-center p-1 text-black mb-2">
                        <h1 className="font-bold text-lg">Alamat Tersimpan</h1>
                    </div>

                    <div className="rounded-2xl bg-[#F2E8C6] py-4 px-2">
                        <div className="scrollbar-hide" style={{
                            maxHeight: '400px',
                            whiteSpace: 'nowrap',
                            overflowY: 'auto'
                        }}>
                            {alamat.map((item, itemIndex) => (
                                <div className="border rounded-xl border-[#A1A1A1] bg-white w-full min-h-[170px] py-4 px-3 flex mb-3" key={itemIndex} onClick={() => handleSelectAddress(item._id)}>
                                    <div className="w-full">
                                        <div className="flex">
                                            <div className="w-fit pe-3 me-2 py-0 my-0" style={{borderRight: '2px solid #A1A1A1'}}>
                                                <b>{item.nama}</b>
                                            </div>
                                            <b className="text-[#A1A1A1]">({item.no_telp})</b>
                                        </div>
                                        <p className="mb-2 mt-2 text-[18px]">{item.nama_jalan}, {item.kecamatan}</p>
                                        <p className="m-0 text-[#800000] border border-[#800000] w-fit px-2 rounded-md text-b" style={{
                                            display: isSelected(item._id, item.utama) ? 'inline' : 'none',
                                        }}>Utama</p>
                                    </div>
                                    <div className="flex justify-items-center">
                                        <Radio className="flex justify-items-center" radioSize={16} checked={isSelected(item._id, item.utama)} value={true}></Radio>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mb-2 mt-5">
                            <Link to={'/profile/alamat/add'}>
                                <Button
                                    type="secondary"
                                    className="bg-transparent hover:text-red-700 text-red-800 font-semibold rounded-3xl h-6 py-4 justify-items-center text-base w-fit"
                                >
                                    <HiPlusCircle style={{fontSize: '20px'}}/>
                                    <span className="" style={{marginBottom: '3px'}}>Tambah Alamat</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        ))}
        </ConfigProvider>
    );
};

export default AlamatTersimpan;