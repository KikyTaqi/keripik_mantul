import React, { useState, useEffect } from "react";
import { Button, Tabs, ConfigProvider, Pagination } from "antd";
import axios from "axios";
import { URL_USER } from "../../utils/Endpoint";
import { useNavigate, Link } from "react-router-dom";
import "../../style.css";
import { jwtDecode } from "jwt-decode";

const Order = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const decoded = jwtDecode(token);
        const response = await axios.post(`${URL_USER}/profile`, {
          email: decoded.email,
        });
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

  const items = [
    { key: "1", label: "Diproses", children: <Diproses /> },
    { key: "2", label: "Dikirim", children: <Dikirim /> },
    { key: "3", label: "Selesai", children: <Selesai /> },
  ];

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#b91c1c" },
        components: {
          Tabs: { inkBarColor: "#b91c1c" },
          Button: {
            colorPrimary: "#800000",
            colorPrimaryHover: "#991b1b",
            borderRadius: 20,
          },
        },
      }}
    >
      <div className="border p-2 border-[#F2E8C6] rounded-md">
        <div className="bg-[#F2E8C6] text-center rounded-lg p-2 text-black font-bold text-lg">
          Pesanan Saya
        </div>
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={setActiveTab}
          className="custom-tabs"
          centered
          items={items}
        />
      </div>
    </ConfigProvider>
  );
};

const PaginatedList = ({ data, showReviewButton = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Bisa diubah sesuai kebutuhan

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <hr className="border-b-2 border-red-800 mb-3" />
      {paginatedData.map((item, index) => (
        <div key={index} className="p-2 border border-gray-300 rounded-md mb-3">
          <div className="grid grid-cols-5 gap-x-3">
            <div>
              <img
                src={item.image}
                alt="Produk"
                className="object-cover p-4 max-h-[30vh] min-h-[30vh]"
              />
            </div>
            <div className="col-span-4 grid grid-cols-4 my-auto text-lg font-semibold">
              <div className="col-span-3">
                <h1>{item.name}</h1>
                <p className="font-normal text-gray-600">×{item.qty}</p>
              </div>
              <div className="text-end pe-5">
                <h1>Rp {item.price}</h1>
                <h1>Total: Rp {item.total}</h1>
              </div>
              <div className="flex justify-end w-full pt-12 pe-5 col-span-4">
                <Link to={`/profile/order/detail`}>
                  <Button type="primary" className="px-10 py-4 text-base font-semibold me-3">
                    Lihat
                  </Button>
                </Link>
                {showReviewButton && (
                  <Link to={`/profile/order/review`}>
                    <Button type="primary" className="px-10 py-4 text-base font-semibold">
                      Beri Ulasan
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={data.length}
          pageSize={itemsPerPage}
          onChange={(page) => setCurrentPage(page)}
          className="custom-pagination mb-4"
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

const Diproses = () => {
  const data = [
    {
      image:
        "https://res.cloudinary.com/drlckqgew/image/upload/v1737338748/mfpcyton3edmwxk48qeb.gif",
      name: "Keripik singkong original 500 gram",
      qty: 1,
      price: "22.000",
      total: "22.000",
    },
    {
      image:
        "https://res.cloudinary.com/drlckqgew/image/upload/v1737338748/mfpcyton3edmwxk48qeb.gif",
      name: "Keripik singkong pedas 500 gram",
      qty: 1,
      price: "25.000",
      total: "25.000",
    },
  ];
  return <PaginatedList data={data} />;
};

const Dikirim = () => {
  const data = [
    {
      image:
        "https://res.cloudinary.com/drlckqgew/image/upload/v1737341867/ws0hhuoavofy68xjdwz6.jpg",
      name: "Keripik pisang original 500 gram",
      qty: 1,
      price: "22.000",
      total: "22.000",
    },
    {
      image:
        "https://res.cloudinary.com/drlckqgew/image/upload/v1737341867/ws0hhuoavofy68xjdwz6.jpg",
      name: "Keripik pisang madu 500 gram",
      qty: 1,
      price: "24.000",
      total: "24.000",
    },
  ];
  return <PaginatedList data={data} />;
};

const Selesai = () => {
  const data = [
    {
      image:
        "https://res.cloudinary.com/drlckqgew/image/upload/v1736823006/kftpc5xpshxbbyzogazg.gif",
      name: "Keripik talas original 500 gram",
      qty: 1,
      price: "22.000",
      total: "22.000",
    },
    {
      image:
        "https://res.cloudinary.com/drlckqgew/image/upload/v1736823006/kftpc5xpshxbbyzogazg.gif",
      name: "Keripik talas pedas 500 gram",
      qty: 1,
      price: "26.000",
      total: "26.000",
    },
  ];
  return <PaginatedList data={data} showReviewButton={true} />;
};

export default Order;
