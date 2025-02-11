import React, { useState, useEffect } from "react";
import { Button, Tabs, ConfigProvider, Pagination } from "antd";
import { LuMapPin } from "react-icons/lu";
import axios from "axios";
import { URL_USER } from "../../utils/Endpoint";
import { useNavigate } from "react-router-dom";
import "../../style.css";
import { jwtDecode } from "jwt-decode";

const OrderDetail = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#b91c1c" },
        components: {
          Button: {
            colorPrimary: "#800000",
            colorPrimaryHover: "#991b1b",
            borderRadius: 20,
          },
        },
      }}
    >
      <div className="border p-2 border-[#F2E8C6] rounded-md">
        <div className="bg-[#F2E8C6] text-center p-2 text-black font-bold text-lg rounded-lg">
          Rincian Pesanan
        </div>

        <div className="bg-[#F2E8C6] rounded-xl m-2 p-3">
          <div className="bg-red-800 p-3 ps-6 text-white font-semibold text-lg rounded-2xl mb-5">
            Pesanan Anda sedang diproses
          </div>
          <div className="px-2">
            <h1 className="font-bold text-base">Alamat Pengiriman</h1>
            <div className="flex mt-3 cursor-pointer">
              <LuMapPin className="text-4xl" />
              <div className="flex justify-between mx-3 w-full">
                <div className="font-medium text-base">
                  <p>Anu (089888888)</p>
                  <p>Jalan Anu, Kecamatan. Itu, Kab. Apalah</p>
                </div>
              </div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-2 mb-4">
              <div className="font-bold text-base">No. Pesanan</div>
              <div className="text-end text-lg">10</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="font-bold text-base">Metode Pembayaran</div>
              <div className="text-end text-lg">Transfer Bank</div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-5">
              <div className="">
                <img
                  src={`https://res.cloudinary.com/drlckqgew/image/upload/v1736823006/kftpc5xpshxbbyzogazg.gif`}
                  alt="Produk"
                  className="object-cover p-4 max-h-[30vh] min-h-[30vh]"
                />
              </div>
              <div className="col-span-3 text-lg font-semibold pt-6">
                <p>Keripik singkong original 500 gram</p>
              </div>
              <div className="text-lg font-semibold text-end flex flex-col justify-end pb-5">
                <p>Rp 22.000</p>
              </div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-2 text-base font-semibold">
              <div className="">Subtotal Produk</div>
              <div className="text-end text-lg">Rp 22.000</div>
            </div>
            <div className="grid grid-cols-2 text-base font-semibold">
              <div className="">Subtotal Pengiriman</div>
              <div className="text-end text-lg">Rp 0</div>
            </div>
            <div className="grid grid-cols-2 text-base font-semibold">
              <div className="">Diskon Produk</div>
              <div className="text-end text-lg">Rp 0</div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-6 text-base font-semibold">
              <div className="col-end-6">Total Pesanan :</div>
              <div className="col-end-7 text-end text-lg">Rp 22.000</div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-2 text-base font-semibold">
              <div className="">Waktu Pemesanan</div>
              <div className="text-end text-lg">12-12-2024 13.00</div>
            </div>
            <div className="grid grid-cols-2 text-base font-semibold">
              <div className="">Waktu Pembayaran</div>
              <div className="text-end text-lg">12-12-2024 13.00</div>
            </div>

            {/* Jika Statusnya Dikirim */}
            <div className="grid grid-cols-2 text-base font-semibold">
              <div className="">Waktu Pengiriman</div>
              <div className="text-end text-lg">12-12-2024 13.00</div>
            </div>

            {/* Jika statusnya Selesai */}
            <div className="grid grid-cols-2 text-base font-semibold">
              <div className="">Waktu Selesai</div>
              <div className="text-end text-lg">12-12-2024 13.00</div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Link to={`/profile/order/review`}>
                <Button type="primary" className="px-10 py-4 text-base">
                    Beri Ulasan
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default OrderDetail;
