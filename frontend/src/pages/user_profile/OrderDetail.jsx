import React, { useState, useEffect } from "react";
import { Button, ConfigProvider } from "antd";
import { LuMapPin } from "react-icons/lu";
import axios from "axios";
import { URL_TRANSACTION } from "../../utils/Endpoint";
import { useNavigate, Link, useParams } from "react-router-dom";
import "../../style.css";

const OrderDetail = () => {
  const { id } = useParams(); // Ambil ID transaksi dari URL
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`${URL_TRANSACTION}/${id}`);
        console.log("Response lengkap dari API:", response); // Debugging response
        console.log("Data transaksi:", response.data); // Debugging data transaksi
        setTransaction(response.data);
      } catch (error) {
        console.error("Error fetching order detail:", error.response?.data || error.message);
        navigate("/profile/order");
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchOrderDetail();
    }
  }, [id, navigate]);
  

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!transaction) return <div className="text-center mt-10">Pesanan tidak ditemukan</div>;

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
            Status: {transaction.status}
          </div>
          <div className="px-2">
            <h1 className="font-bold text-base">Alamat Pengiriman</h1>
            <div className="flex mt-3">
              <LuMapPin className="text-4xl" />
              <div className="mx-3">
                <p>{transaction.first_name} ({transaction.user_id.no_telp})</p>
                <p>{transaction.alamat_id?.alamat || transaction.shipping_address}</p>
              </div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-2 mb-4">
              <div className="font-bold text-base">No. Pesanan</div>
              <div className="text-end text-lg">{transaction.transaction_id}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="font-bold text-base">Metode Pembayaran</div>
              <div className="text-end text-lg">{transaction.payment_method}</div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            {/* Produk dalam pesanan */}
            {transaction.items?.map((item, index) => {
              const product = item._id || {}; // Pastikan `id` ada untuk menghindari error
              console.log("anjkdjkahj:" + item.id);    
              return (
                <div key={index} className="grid grid-cols-5">
                  <div>
                    <img src={product.item_details.image} alt={product.item_details.name} className="object-cover p-4 max-h-[30vh] min-h-[30vh]" />
                  </div>
                  <div className="col-span-3 text-lg font-semibold pt-6">
                    <p>{product.name}</p>
                    <p className="text-gray-600 font-normal">×{item.quantity}</p>
                  </div>
                  <div className="text-lg font-semibold text-end flex flex-col justify-end pb-5">
                    <p>Rp {product.price?.toLocaleString("id-ID")}</p>
                    <p className="text-gray-500">Total: Rp {(product.price * item.quantity)?.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              );
            })}


            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-2 text-base font-semibold">
              <div>Subtotal Produk</div>
              <div className="text-end text-lg">Rp {transaction.subtotal?.toLocaleString("id-ID")}</div>
            </div>
            <div className="grid grid-cols-2 text-base font-semibold">
              <div>Subtotal Pengiriman</div>
              <div className="text-end text-lg">Rp {transaction.shipping_cost?.toLocaleString("id-ID")}</div>
            </div>
            <div className="grid grid-cols-2 text-base font-semibold">
              <div>Diskon Produk</div>
              <div className="text-end text-lg">Rp {transaction.discount?.toLocaleString("id-ID")}</div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-6 text-base font-semibold">
              <div className="col-end-6">Total Pesanan :</div>
              <div className="col-end-7 text-end text-lg">Rp {transaction.total_price?.toLocaleString("id-ID")}</div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-2 text-base font-semibold">
              <div>Waktu Pemesanan</div>
              <div className="text-end text-lg">{new Date(transaction.order_time).toLocaleString("id-ID")}</div>
            </div>
            <div className="grid grid-cols-2 text-base font-semibold">
              <div>Waktu Pembayaran</div>
              <div className="text-end text-lg">{transaction.payment_time || "-"}</div>
            </div>

            {/* Jika statusnya Dikirim */}
            {transaction.status === "dikirim" && (
              <div className="grid grid-cols-2 text-base font-semibold">
                <div>Waktu Pengiriman</div>
                <div className="text-end text-lg">{transaction.shipping_time || "-"}</div>
              </div>
            )}

            {/* Jika statusnya Selesai */}
            {transaction.status === "selesai" && (
              <div className="grid grid-cols-2 text-base font-semibold">
                <div>Waktu Selesai</div>
                <div className="text-end text-lg">{transaction.completion_time || "-"}</div>
              </div>
            )}

            {/* Tombol Beri Ulasan jika statusnya selesai */}
            {transaction.status === "selesai" && (
              <div className="flex justify-end mt-4">
                <Link to={`/profile/order/review/${transaction.id || transaction._id}`}>
                  <Button type="primary" className="px-10 py-4 text-base">
                    Beri Ulasan
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default OrderDetail;
