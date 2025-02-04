import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ConfigProvider } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { URL_PROFILE, URL_USER } from "../../../utils/Endpoint";

const DashboardProfile = () => {
  const [profile, setProfile] = useState([]);

  // Ambil data profil saat komponen pertama kali dimuat
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const decoded = jwtDecode(token); // Decode token untuk mendapatkan email
      const response = await axios.post(`${URL_USER}/profile`, { email: decoded.email });
      console.log("COBAOBCOABCAP: "+response.data);
      
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  return (
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#800000',
            }
        }}
    >
    {profile.map((data, index) => (
      <div className="border border-stone-300 py-12 px-8 flex flex-col justify-center items-center" key={index}>
        <div className="flex gap-10">
            <div className="mb-4 flex flex-col text-end gap-5">
                <p className="font-semibold">Nama:</p>
                <p className="font-semibold">Email:</p>
                <p className="font-semibold">Nomor Telepon:</p>
            </div>
            <div className="mb-4 flex flex-col text-start gap-5">
                <p className="text-[#A1A1A1]">{data.name || "(Nama tidak tersedia)"}</p>
                <p className="text-[#A1A1A1]">{data.email || "(Email tidak tersedia)"}</p>
                <p className="text-[#A1A1A1]">{data.no_telp || "(Nomor tidak tersedia)"}</p>
            </div>
        </div>
        <div className="flex justify-end gap-4 w-full mt-7">
            <Link to="/dashboard/profile/edit/password">
                <Button type="secondary" className="bg-red-800 text-white px-4 pb-1 rounded-[30px] hover:bg-red-700">
                Ubah Password
                </Button>
            </Link>
            <Link to="/dashboard/profile/edit">
                <Button type="secondary" className="bg-red-800 text-white px-4 pb-1 rounded-[30px] hover:bg-red-700">
                Edit Profile
                </Button>
            </Link>
        </div>
      </div>
    ))}
    </ConfigProvider>
  );
};

export default DashboardProfile;
