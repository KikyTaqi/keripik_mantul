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
  let [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const getTransactionStatus = async (order_id) => {
        try {
            //   const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.sandbox.midtrans.com/v2/${order_id}/status`, {
            //     headers: {
            //         "Authorization": `Basic ${btoa("SB-Mid-server-2qVIMYB5QItBfIQqQCGttOjL" + ":")}`
            //     }
            // });
        

            console.log("Data Transaksi:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error mengambil data transaksi:", error.response?.data || error.message);
        }
    };

    // Contoh pemanggilan
    // getTransactionStatus("ORDER-1739341538643");

    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`${URL_TRANSACTION}/${id}`);
        // console.log("Response lengkap dari API:", response); // Debugging response
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
  }, [id]);
  
  useEffect(() => {
    const calculatedSubtotal = transaction?.item_details?.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(calculatedSubtotal || 0);
  }, [transaction]);

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
                <p>{transaction.alamat?.nama_jalan}, {transaction.alamat?.kecamatan}</p>
              </div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-2 mb-4">
              <div className="font-bold text-base">No. Pesanan</div>
              <div className="text-end text-lg">{transaction.transaction_id}</div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            {/* Produk dalam pesanan */}
            {transaction.item_details?.map((item, index) => {
              return (
                <div key={index} className="grid grid-cols-5">
                  <div>
                    <img src={item.image} alt={item.name} className="object-cover w-full p-4 max-h-[30vh] min-h-[30vh]" />
                  </div>
                  <div className="col-span-3 text-lg font-semibold pt-6">
                    <p>{item.name}</p>
                    <p className="text-gray-600 font-normal">×{item.quantity}</p>
                  </div>
                  <div className="text-lg font-semibold text-end flex flex-col justify-end pb-5">
                    <p>Rp {item.price?.toLocaleString("id-ID")}</p>
                    <p className="">Total: Rp {(item.price * item.quantity)?.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              );
            })}

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-2 text-base font-semibold">
              <div>Subtotal Produk</div>
              <div className="text-end text-lg">Rp {subtotal.toLocaleString("id-ID")}</div>
            </div>
            <div className="grid grid-cols-2 text-base font-semibold">
              <div>Subtotal Pengiriman</div>
              <div className="text-end text-lg">Rp 3.000</div>
            </div>
            {/* <div className="grid grid-cols-2 text-base font-semibold">
              <div>Diskon Produk</div>
              <div className="text-end text-lg">Rp 0</div>
            </div> */}

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-6 text-base font-semibold">
              <div className="col-end-6">Total Pesanan :</div>
              <div className="col-end-7 text-end text-lg">Rp {transaction.gross_amount?.toLocaleString("id-ID")}</div>
            </div>

            <hr className="my-3 border-[#0000003b] border-b" />

            <div className="grid grid-cols-2 text-base font-semibold">
              <div>Waktu Pemesanan</div>
              <div className="text-end text-lg">{new Date(transaction.createdAt).toLocaleString("id-ID")}</div>
            </div>
            <div className="grid grid-cols-2 text-base font-semibold">
              <div>Waktu Pembayaran</div>
              <div className="text-end text-lg">{new Date(transaction.waktu_pembayaran || transaction.updatedAt).toLocaleString("id-ID")}</div>
            </div>

            {/* Jika statusnya Dikirim */}
            {transaction.status === "dikirim" || transaction.status === "selesai" && (
              <div className="grid grid-cols-2 text-base font-semibold">
                <div>Waktu Pengiriman</div>
                <div className="text-end text-lg">{new Date(transaction.waktu_pengiriman || transaction.updatedAt).toLocaleString("id-ID") || "-"}</div>
              </div>
            )}

            {/* Jika statusnya Selesai */}
            {transaction.status === "selesai" && (
              <div className="grid grid-cols-2 text-base font-semibold">
                <div>Waktu Selesai</div>
                <div className="text-end text-lg">{new Date(transaction.waktu_selesai).toLocaleString("id-ID") || "-"}</div>
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
