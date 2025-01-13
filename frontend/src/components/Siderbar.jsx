import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import logo from "../assets/logo_keripik.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const checkLogin = async () => {
    const userToken = localStorage.removeItem('userToken');
    const userEmail = localStorage.removeItem('userEmail');
    const userRole = localStorage.removeItem('userRole');

    if(userToken == null || userEmail == null || userRole == null){
      console.log("lah kok ke run");
      navigate('/signin');
    }

  }
  const location = useLocation(); // Mendapatkan rute saat ini
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "fa-regular fa-message" },
    { name: "Pesanan", path: "/dashboard/pesanan", icon: "fa-solid fa-bag-shopping" },
    { name: "Produk", path: "/dashboard/products", icon: "fa-solid fa-box-open" },
    { name: "Kategori", path: "/dashboard/kategori", icon: "fa-solid fa-icons" },
    { name: "Ongkos Kirim", path: "/dashboard/ongkos-kirim", icon: "fa-solid fa-truck-fast" },
    { name: "Ulasan", path: "/dashboard/ulasan", icon: "fa-regular fa-comment-dots" },
    { name: "Customer", path: "/dashboard/customer", icon: "fa-solid fa-users" },
    { name: "Log Out", path: "/signin", icon: "fa-solid fa-arrow-right-from-bracket" },
  ];

  

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col rounded-br-lg">
      {/* Logo */}
      <div className="p-4 flex justify-center">
        <img
          src={logo}
          alt="Keripik Martul Logo"
          className="h-16"
        />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2 mb-6">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path; // Periksa apakah rute saat ini aktif
            return (
              <li key={index}  className="border-solid border rounded-lg border-stone-700 hover:border-red-900">
                <Link
                  to={item.path}
                  onClick={(e) => {
                    if (item.name == "Log Out") {
                      checkLogin();
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-3 text-gray-700 hover:text-red-900 hover:bg-orange-100 rounded-lg ${
                    isActive ? "bg-orange-200 text-red-900 font-semibold" : ""
                  }`}
                >
                  <div className="flex">
                    <div className="flex-none w-7">
                        <i className={item.icon}></i>
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
  );
};

export default Sidebar;
