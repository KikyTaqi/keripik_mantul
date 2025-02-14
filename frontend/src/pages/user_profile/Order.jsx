import React, { useState, useEffect } from "react";
import { Button, Tabs, ConfigProvider, Pagination, Popconfirm } from "antd";
import axios from "axios";
import { URL_ALAMAT, URL_TRANSACTION, URL_USER } from "../../utils/Endpoint";
import { useNavigate, Link } from "react-router-dom";
import "../../style.css";
import { jwtDecode } from "jwt-decode";

const Order = () => {
  const [product, setProduct] = useState([{}]);
  const [transaction, setTransaction] = useState([{}]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");
  const [alamat, setAlamat] = useState([{}]);

  const PaginatedList = ({ data, showReviewButton = false, showDoneButton = false }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const handleDone = async (id) => {
      try {
        // console.log("IDDD: "+id);
        await axios.post(`${URL_TRANSACTION}/status/${id}`, { status: "selesai" }).then(res => {
          navigate(0);
        });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }

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
                  <p className="font-normal text-gray-600">×{item.quantity}</p>
                </div>
                <div className="text-end pe-5">
                  <h1>Rp {item.price.toLocaleString("id-ID")}</h1>
                  <h1>Total: Rp {(item.price * item.quantity).toLocaleString("id-ID")}</h1>
                </div>
                <div className="flex justify-end w-full pt-12 pe-5 col-span-4">
                  <Link to={`/profile/order/detail/${item.transaction_id}`}>
                    <Button type="primary" className="px-10 py-4 text-base font-semibold me-3">
                      Lihat
                    </Button>
                  </Link>
                  {showReviewButton && (
                    <Link to={`/profile/order/review/${item.transaction_id || item._id}`}>
                      <Button type="primary" className="px-10 py-4 text-base font-semibold">
                        Beri Ulasan
                      </Button>
                    </Link>
                  )}
                  {showDoneButton && (
                    <>
                      <Popconfirm
                          title="Selesaikan Transaksi Ini?"
                          description="Apakah kamu yakin ingin menyelesaikan transaksi?"
                          onConfirm={() => handleDone(item.transaction_id)}
                          okButtonProps={{ 
                              style: {
                                  backgroundColor: "#800000",
                              }
                          }}
                          cancelButtonProps={{
                              style: {
                                  borderColor: "#800000",
                                  color: "#800000",
                              }
                          }}
                          okText="Iya"
                          cancelText="Batal"
                      >
                        <Button type="primary" className="px-10 py-4 text-base font-semibold">
                          Selesai
                        </Button>
                      </Popconfirm>
                    </>
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
    const data = product
      .filter((item) => item.status === "diproses")
      .flatMap((item) =>
        item.item_details.map((detail) => ({
          ...detail,
          transaction_id: item._id, // Pastikan setiap item memiliki transaction_id
        }))
      );
    return <PaginatedList data={data} showDoneButton={true}/>;
  };
  
  const Dikirim = () => {
    const data = product
      .filter((item) => item.status === "dikirim")
      .flatMap((item) =>
        item.item_details.map((detail) => ({
          ...detail,
          transaction_id: item._id,
        }))
      );
    return <PaginatedList data={data} showDoneButton={true}/>;
  };
  
  const Selesai = () => {
    const data = product
      .filter((item) => item.status === "selesai")
      .flatMap((item) =>
        item.item_details.map((detail) => ({
          ...detail,
          transaction_id: item._id,
        }))
      );
    return <PaginatedList data={data} showReviewButton={true} />;
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const decoded = jwtDecode(token);
        const response = await axios.post(`${URL_USER}/profile`, {
          email: decoded.email,
        });
        setUsers(response.data);
        axios.get(`${URL_TRANSACTION}/checkout/get/${response.data[0]._id}`)
          .then(response => {
            setProduct(response.data);
          })
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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${URL_TRANSACTION}`);
        console.log("Detail transaksi:", response.data);
        setTransaction(response.data);
      } catch (error) {
        console.error("Error fetching order detail:", error);
       } finally {
        setLoading(false);
      }
    };

      fetchOrder();
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

export default Order;
