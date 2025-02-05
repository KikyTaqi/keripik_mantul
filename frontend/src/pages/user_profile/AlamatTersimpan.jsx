import React, { useState, useEffect } from "react";
import { Button, Image, ConfigProvider, message, Radio  } from 'antd';
import { HiPencilSquare } from "react-icons/hi2";
import axios from 'axios';
import { URL_USER } from '../../utils/Endpoint';
import { Link, useNavigate } from 'react-router-dom';
import '../../style.css';
import {jwtDecode} from "jwt-decode";

const AlamatTersimpan = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleSelectAddress = (id) => {
        setSelectedAddress(id);
    };

    const checkSelect = (id) => {
        if(id == selectedAddress){
            return true
        }
        return false
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const decoded = jwtDecode(token); // Decode token untuk mendapatkan email
                const response = await axios.post(`${URL_USER}/profile`, { email: decoded.email });
                setUsers(response.data);
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
        {users.map((data, index) => (
            <>
                <div className="border p-2 border-[#F2E8C6]" key={index}>
                    <div className="bg-[#F2E8C6] rounded-md text-center p-1 text-black mb-2">
                        <h1 className="font-bold text-lg">Alamat Tersimpan</h1>
                    </div>

                    <div className="rounded-2xl bg-[#F2E8C6] py-4 px-2">
                        <div className="border rounded-xl border-[#A1A1A1] bg-white w-full min-h-[170px] py-4 px-3 flex" onClick={() => handleSelectAddress(data.id)}>
                            <div className="w-full">
                                <div className="flex">
                                    <div className="w-fit pe-3 me-2 py-0 my-0" style={{borderRight: '2px solid #A1A1A1'}}>
                                        <b>Viola</b>
                                    </div>
                                    <b className="text-[#A1A1A1]">(+62 812-3456-7890)</b>
                                </div>
                                <p className="mb-0 mt-2 text-[18px]">Dusun Krajan RT.01/RW.06, Salamsari, Boja, Kab Kendal, Jawa Tengah, ID, 51381</p>
                                <p className="m-0 text-[#800000] border border-[#800000] w-fit px-2 rounded-md text-b mt-2">Utama</p>
                            </div>
                            <div className="flex justify-items-center">
                                <Radio className="flex justify-items-center" radioSize={16} checked={checkSelect(data.id)} onChange={(e) => setSelected(e.target.value)}value={true}></Radio>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pe-7 mb-5">
                        <Link to={'/profile/edit'}>
                            <Button
                                type="secondary"
                                className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base w-28"
                            >
                                <HiPencilSquare />
                                <span className=" ms-1 mb-1">Edit</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </>
        ))}
        </ConfigProvider>
    );
};

export default AlamatTersimpan;