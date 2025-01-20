import { React, useEffect } from "react";
import { FaSearch, FaUserCircle, FaCartPlus } from "react-icons/fa";
import { Link, useNavigate, useLocation, matchPath } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
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
      { name: "Tambah Produk", path: "/dashboard/products/create", back: true },
      { name: "Edit Produk", path: "/dashboard/products/edit/:id", back: true },
      { name: "Detail Produk", path: "/dashboard/products/detail/:id", back: true },
      { name: "Kategori", path: "/dashboard/kategori" },
      { name: "Tambah Kategori", path: "/dashboard/kategori/create", back: true },
      { name: "Edit Kategori", path: "/dashboard/kategori/edit/:id", back: true },
      { name: "Ongkos Kirim", path: "/dashboard/ongkir" },
      { name: "Ulasan", path: "/dashboard/ulasan" },
      { name: "Customer", path: "/dashboard/customer" },
    ];

    const activeMenu = menuItems.find((item) => {
      // Gunakan matchPath untuk mencocokkan rute dinamis seperti /dashboard/products/edit/:id
      const match = matchPath(item.path, location.pathname);
      return match !== null;
    });

    const handleBack = () => {
      navigate(-1); 
    };

    return (
      <div className="flex items-center justify-between border-b-red-800 border border-b-4 px-8 py-4 bg-white">
        {/* Title */}
        <div className="flex">
            {activeMenu && activeMenu.back && (
              <button onClick={handleBack} className="text-4xl text-red-800 me-4">
                <IoArrowBackCircleOutline />
              </button>
            )}

            <h1 className="text-2xl font-semibold" style={{ color: "#800000" }}>
              {activeMenu ? activeMenu.name : "Dashboard"}
            </h1>
        </div>

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

    const menuItems = [
      { name: "Home", path: "/" },
      { name: "Produk", path: "/products" },
      { name: "About", path: "/about" },
    ];
    return (
      <div className="flex items-center justify-between ps-24 pe-10 py-4 bg-white border-b-red-800 border border-b-2">
        <img src={logo} className="h-12" alt="logo" />
        
        <div className="flex justify-evenly w-full">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-semibold text-red-800 hover:text-red-600 mx-4 ${
                location.pathname === item.path ? "border-b-2 border-red-800" : ""
              }`}
              style={{
                fontSize: "1rem",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          {/* Search Bar */}
          <div className="flex items-center border-solid border rounded-lg ms-5 me-4 px-4 py-2 border-red-800">
            <input
              type="text"
              placeholder="Cari..."
              className="focus:outline-none w-[439px] font-semibold text-red-800 placeholder-red-800"
            />
            <FaSearch className="text-red-800 ml-10" />
          </div>

          {/* Cart Icon */}
          <FaCartPlus className="text-red-800 text-3xl object-right ms-8" />
          {/* User Icon */}
          <FaUserCircle className="text-red-800 text-3xl object-right ms-10" />
        </div>
      </div>
    );
  }
};

export default Header;
