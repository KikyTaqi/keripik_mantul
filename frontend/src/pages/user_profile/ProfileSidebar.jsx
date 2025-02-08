import {React, useState, useEffect} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { FaTruckFast } from "react-icons/fa6";
import { LuMapPin } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {URL_USER} from "../../utils/Endpoint";

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const decoded = jwtDecode(token); // Decode token untuk mendapatkan email
      const response = await axios.post(`${URL_USER}/profile`, { email: decoded.email });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const checkLogin = async () => {
    const userToken = localStorage.removeItem('userToken');

    if(userToken == null || userEmail == null || userRole == null){
      navigate('/signin');
    }
  }

  const location = useLocation(); // Mendapatkan rute saat ini
  const isProfile = location.pathname == "/profile";

  const menuItems = [
    { name: "Pesanan Saya", path: "/profile/w", icon: <FaTruckFast /> },
    { name: "Alamat Tersimpan", path: "/profile/alamat", icon: <LuMapPin /> },
    { name: "Produk Favorit", path: "/profile/s", icon: <FaRegHeart /> },
    { name: "Ubah Password", path: "/profile/password/change", icon: <TbLockPassword /> },
    { name: "Log Out", path: "/profile/z", icon: <MdLogout /> },
  ];

  return (
    <>
    {profile.map((data, index) => (
    
    <div className="bg-white shadow-lg h-full flex flex-col border rounded-lg" style={{ width: '19rem' }} key={index}>
      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <h1 className="font-bold text-base mb-5">Akun Saya</h1>
        <ul className="space-y-2 mb-6">
          <li key={0} className="border-solid border rounded-lg border-stone-700 hover:border-red-900">
            <Link
              to="/profile"
              className={`flex items-center justify-between px-4 py-3 text-gray-700 hover:text-red-900 hover:bg-orange-100 rounded-lg ${
                isProfile ? "bg-orange-200 text-red-900" : ""
              }`}
            >
              <div className="flex">
                <div className="flex-1 me-4">
                  <img 
                      src={data.profile_image}
                      alt="Foto Profile"
                      style={{
                        width: '6rem',
                        height: '6rem',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        padding: 3,
                      }}
                  />
                </div>
                <div className="flex-1 me-3 py-6" style={{ maxWidth: '100px'}}>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="font-medium">{data.name || "(Kosong)"}</p>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.email || "(Email tidak tersedia)"}</p>
                </div>
              </div>
              <RightOutlined />
            </Link>
          </li>

          {menuItems.map((item, index) => {
            const isDashboardActive = item.path === "/dashboard" && location.pathname === "/dashboard";
            const isActive = item.path !== "/dashboard" && location.pathname.startsWith(item.path);

            return (
              <li key={index} className="border-solid border rounded-lg border-stone-700 hover:border-red-900">
                <Link
                  to={item.path}
                  onClick={(e) => {
                    if (item.name === "Log Out") {
                      checkLogin();
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-2 text-gray-700 hover:text-red-900 hover:bg-orange-100 rounded-lg ${
                    isDashboardActive || isActive ? "bg-orange-200 text-red-900 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-none me-4 text-center rounded-lg text-2xl p-2" style={{ backgroundColor: '#f2f2f2', minWidth: '3vw' }}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <span>{item.name}</span>
                    </div>
                  </div>
                  <RightOutlined />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
    ))}
    </>
  );
};

export default ProfileSidebar;
