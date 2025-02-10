import { React, useEffect, useState } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaRegUserCircle,
  FaCartPlus,
} from "react-icons/fa";
import { BsCart, BsCartFill } from "react-icons/bs";
import { Link, useNavigate, useLocation, matchPath } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { Dropdown, message, Space, Button, AutoComplete, Input, ConfigProvider } from "antd";
import logo from "../assets/logo_keripik.png";
import { URL_PRODUCT } from "../utils/Endpoint";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const navigate = useNavigate();
  let [isCheck, setIsCheck] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const tokenVerified = getUserFromToken(userToken);

  function getUserFromToken(localToken) {
    const token = localToken; // Ambil token dari localStorage
    if (!token) return null; // Jika token tidak ada

    try {
      const decoded = jwtDecode(token); // Decode token
      return decoded; // Kembalikan payload token
    } catch (err) {
      console.error("Invalid token", err);
      return null; // Jika token tidak valid
    }
  }

  useEffect(() => {
    const checkLogin = () => {
      setIsCheck(false);
      if (userToken != null) {
        setIsCheck(true);
      }
    };
    checkLogin();
  }, [navigate]);

  function handleActiveLink(currentPath, path) {
    let pathActive = "";

    if (path === "/products" && currentPath.startsWith(path)) {
      pathActive = "border-b-2 border-red-800";
    } else if (currentPath === path) {
      pathActive = "border-b-2 border-red-800";
    }

    return pathActive;
  }

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
      {
        name: "Detail Produk",
        path: "/dashboard/products/detail/:id",
        back: true,
      },
      { name: "Kategori", path: "/dashboard/kategori" },
      {
        name: "Tambah Kategori",
        path: "/dashboard/kategori/create",
        back: true,
      },
      {
        name: "Edit Kategori",
        path: "/dashboard/kategori/edit/:id",
        back: true,
      },
      { name: "Ongkos Kirim", path: "/dashboard/ongkir" },
      { name: "Ulasan", path: "/dashboard/ulasan" },
      { name: "Customer", path: "/dashboard/customer" },
      { name: "Profil", path: "/dashboard/profile" },
      { name: "Edit Profil", path: "/dashboard/profile/edit", back: true },
      {
        name: "Change Password",
        path: "/dashboard/profile/edit/password",
        back: true,
      },
    ];

    const activeMenu = menuItems.find((item) => {
      // Gunakan matchPath untuk mencocokkan rute dinamis seperti /dashboard/products/edit/:id
      const match = matchPath(item.path, location.pathname);
      return match !== null;
    });

    const handleBack = () => {
      navigate(-1);
    };

    const handleProfile = () => {
      const btn = document.getElementById("profileButton");
      // console.log(btn);
      btn.addEventListener("click", () => {
        if (isCheck) {
          const userEmail = tokenVerified.email;
          const userRole = tokenVerified.role;
          console.log("User Email: " + userEmail);
          console.log("User Role: " + userRole);
          if (userEmail == null) {
            navigate("/signin");
          }
          if (userRole !== "Admin") {
            navigate("/");
          } else {
            navigate("/dashboard/profile");
          }
        }
      });
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

        <div
          className="flex items-center"
          id="profileButton"
          onClick={handleProfile}
        >
          {/* User Icon */}
          {location.pathname == "/dashboard/profile" ? (
            <FaUserCircle
              className={`text-red-800 text-3xl object-right ms-8 hover:cursor-pointer`}
            />
          ) : (
            <FaRegUserCircle
              className={`text-red-800 text-3xl object-right ms-8 hover:cursor-pointer`}
            />
          )}
        </div>
      </div>
    );
  } else {
    // Jika path bukan "/dashboard"
    const removeLogin = async () => {
      const userToken = localStorage.removeItem("userToken");
    };
    const [options, setOptions] = useState([]);
    const [Products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState(""); // Input pencarian

    useEffect(() => {
      const fetchData = async () => {
          try {
              setLoading(true);
              const [productResponse] = await Promise.all([
                  axios.get(URL_PRODUCT),
              ]);

              setProducts(productResponse.data);
          } catch (err) {
              message.error("Gagal memuat data!");
              console.error(err);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, []);

    // Simulasi hasil pencarian
    const searchResults = Products || [
      { name: "Search List" },
      { name: "Data Entry - Search" },
      { name: "Data List - Search data" },
      { name: "Data List - Search" },
      { name: "Global search" },
      { name: "Navigation - Efficiency" },
    ];

    const handleSearch = (name) => {
      setOptions(
        name
          ? searchResults
              .filter((item) => item.name.toLowerCase().includes(name.toLowerCase()))
              .map((item) => ({ value: item.name })) // Ubah name menjadi value
          : []
      );
    };

    const handleSelect = (value) => {
      navigate(`/products?search=${encodeURIComponent(value)}`);
    };

    const handleSearchEnter = (e) => {
      if (e.key === "Enter") {
        navigate(`/products?search=${searchValue}`);
      }
    };
    

    const items = [
      {
        key: "1",
        label: <Link to="/profile">Profile Saya</Link>,
        icon: <FaUserCircle />,
      },
      {
        key: "2",
        label: (
          <Link
            to="/signin"
            onClick={(e) => {
              removeLogin();
            }}
          >
            Logout
          </Link>
        ),
        icon: <FiLogOut />,
      },
    ];

    const menuItems = [
      { name: "Home", path: "/" },
      { name: "Produk", path: "/products" },
      { name: "About", path: "/about" },
    ];
    return (
      <div className="flex items-center justify-between ps-24 pe-10 py-4 bg-white border-b-red-800 border border-b-2">
        <img
          src={logo}
          className="h-12"
          alt="logo"
          onClick={() => {
            navigate("/");
          }}
        />

        <div className="flex justify-evenly w-full">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-semibold text-red-800 hover:text-red-600 mx-4 ${handleActiveLink(
                location.pathname,
                item.path
              )}`}
              style={{
                fontSize: "1rem",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          <div className="flex items-center border-solid border rounded-lg ms-5 me-4 px-4 py-1 border-red-800 w-[450px]">
              <AutoComplete
                style={{ width: "100%" }}
                options={options}
                onSearch={handleSearch}
                onSelect={handleSelect}
                placeholder="Cari..."
                variant="borderless"
                className="border-none focus:border-none focus:outline-none shadow-none"
              >
                <Input
                 className="font-semibold text-red-800 placeholder-red-800" 
                 value={searchValue}
                 onChange={(e) => setSearchValue(e.target.value)}
                 onKeyDown={handleSearchEnter}
                 variant="borderless"
                 type="search"
                 />
              </AutoComplete>
            <FaSearch className="text-red-800 ml-3" />
          </div>

          {isCheck ? (
            <>
              <Link to="/cart">
                {location.pathname == "/cart" ? (
                  <BsCartFill
                    className={`text-red-800 text-3xl object-right ms-8`}
                  />
                ) : (
                  <BsCart
                    className={`text-red-800 text-3xl object-right ms-8`}
                  />
                )}
              </Link>
              <Dropdown
                menu={{
                  items,
                }}
                overlayStyle={{
                  width: "200px",
                  boxShadow: "2px 4px 39px -10px rgba(0,0,0,0.01)",
                  WebkitBoxShadow: "2px 4px 39px -10px rgba(0,0,0,0.01)",
                  borderRadius: "30%",
                }}
                placement="bottomRight"
                arrow
                trigger={["hover"]}
              >
                <Link to="/profile">
                  {location.pathname == "/profile" ? (
                    <FaUserCircle
                      className={`text-red-800 text-3xl object-right ms-8`}
                    />
                  ) : (
                    <FaRegUserCircle
                      className={`text-red-800 text-3xl object-right ms-8`}
                    />
                  )}
                </Link>
              </Dropdown>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button
                  type="secondary"
                  className="border-0 border-red-800 hover:border-red-600 hover:text-red-700"
                  style={{
                    backgroundColor: "#800000",
                    color: "white",
                    borderRadius: "15px",
                    padding: "0px 15px 3px 15px",
                    height: "35px",
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default Header;
