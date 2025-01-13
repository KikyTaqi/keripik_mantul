import { React, useEffect } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo_keripik.png";

const Header = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkLogin = () => {
        const userToken = localStorage.getItem('userToken');
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');

        if (userToken == null || userEmail == null || userRole == null) {
            navigate('/signin');
        }
    };
    checkLogin();
  }, [navigate]);

  const location = useLocation(); // Mendapatkan rute saat ini

  // Cek apakah path saat ini adalah "/dashboard" atau sub-pathnya
  const isDashboardPath = location.pathname.startsWith("/dashboard");

  if (isDashboardPath) {
    // Jika path adalah "/dashboard" atau sub-path lainnya
    const menuItems = [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Pesanan", path: "/dashboard/pesanan" },
      { name: "Produk", path: "/dashboard/products" },
      { name: "Kategori", path: "/dashboard/kategori" },
      { name: "Ongkos Kirim", path: "/dashboard/ongkos-kirim" },
      { name: "Ulasan", path: "/dashboard/ulasan" },
      { name: "Customer", path: "/dashboard/customer" },
    ];

    const activeMenu = menuItems.find((item) => {
      if (item.path === "/dashboard") {
        return location.pathname === item.path;
      }
      return location.pathname.startsWith(item.path);
    });

    return (
      <div className="flex items-center justify-between border-b-red-800 border border-b-4 px-8 py-4 bg-white">
        {/* Title */}
        <h1 className="text-2xl font-semibold" style={{ color: "#800000" }}>
          {activeMenu ? activeMenu.name : "Dashboard"}
        </h1>

        <div className="flex items-center">
          {/* Search Bar */}
          <div className="flex items-center border-solid border rounded-lg ms-5 me-4 px-4 py-2 border-red-800">
            <input
              type="text"
              placeholder="Cari ..."
              className="focus:outline-none w-100 font-semibold text-red-800 placeholder-red-800"
            />
            <FaSearch className="text-red-800 ml-10" />
          </div>

          {/* User Icon */}
          <FaUserCircle className="text-red-800 text-3xl object-right" />
        </div>
      </div>
    );
  } else {
    // Jika path bukan "/dashboard"
    return (
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b-red-800 border border-b-2">
        <img src={logo} className="h-12" alt="logo" />
        

        <div className="flex items-center">
          {/* Search Bar */}
          <div className="flex items-center border-solid border rounded-lg ms-5 me-4 px-4 py-2 border-red-800">
            <input
              type="text"
              placeholder="Search here..."
              className="focus:outline-none w-100 font-semibold text-red-800 placeholder-red-800"
            />
            <FaSearch className="text-red-800 ml-10" />
          </div>

          {/* User Icon */}
          <FaUserCircle className="text-red-800 text-3xl object-right" />
        </div>
      </div>
    );
  }
};

export default Header;
