import React, { useState, useEffect } from "react";
import { Button, Image, ConfigProvider, message, Upload  } from 'antd';
import { HiPencilSquare } from "react-icons/hi2";
import axios from 'axios';
import { URL_USER } from '../../utils/Endpoint';
import { Link, useNavigate } from 'react-router-dom';
import '../../style.css';
import {jwtDecode} from "jwt-decode";


const Profile = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                     // Primary color untuk seluruh aplikasi
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
            <div className="border p-2 border-[#F2E8C6]" key={index}>
                <div className="bg-[#F2E8C6] rounded-md text-center p-1 text-black">
                    <h1 className="font-bold text-lg">Profil Saya</h1>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-center mb-16 py-16">
                        <div className="flex items-stretch">
                            <table className="table-auto">
                                <tbody>
                                    <tr className="text-lg">
                                        <td className="font-medium text-right">Nama</td>
                                        <td className="font-medium">:</td>
                                        <td className="ps-5 font-base text-stone-400">{data.name || "(Nama tidak tersedia)"}</td>
                                    </tr>
                                    <tr className="text-lg">
                                        <td className="font-medium text-right">Email</td>
                                        <td className="font-medium">:</td>
                                        <td className="ps-5 font-base text-stone-400">{data.email || "(Email tidak tersedia)"}</td>
                                    </tr>
                                    <tr className="text-lg">
                                        <td className="font-medium text-right">Nomor Telepon</td>
                                        <td className="font-medium">:</td>
                                        <td className="ps-5 font-base text-stone-400">{data.no_telp || "(Nomor telepon tidak tersedia)"}</td>
                                    </tr>
                                    <tr className="text-lg">
                                        <td className="font-medium text-right">Tanggal Lahir</td>
                                        <td className="font-medium">:</td>
                                        <td className="ps-5 font-base text-stone-400">
                                            {data.tgl_lahir
                                                ? new Date(data.tgl_lahir).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                                : "(Tanggal lahir tidak tersedia)"}
                                        </td>
                                    </tr>
                                    <tr className="text-lg">
                                        <td className="font-medium text-right">Jenis Kelamin</td>
                                        <td className="font-medium">:</td>
                                        <td className="ps-5 font-base text-stone-400">{data.jenis_kelamin || "(Jenis kelamin tidak tersedia)"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <div className="mt-12 mx-16 mb-28 p-12">
                            <div className="border p-3 border-[#F2E8C6]">
                                {console.log(users.profile_image)}
                                <Image 
                                    src={data.profile_image}
                                    alt="Foto Profile"
                                    style={{
                                        // aspectRatio: '1/1',
                                        width: '15rem',
                                        height: '15rem',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
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
        ))}
        </ConfigProvider>
    );
};

export default Profile;
