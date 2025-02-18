import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { URL_TRANSACTION } from "../../utils/Endpoint";
import { message } from 'antd';
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`${URL_TRANSACTION}/${id}`);
        setTransaction(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching order detail:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const handleStatusChange = async () => {
    try {
      await axios.put(`${URL_TRANSACTION}/status/${id}`, { status });
      message.success(`Status berhasil diubah`);
      navigate("/dashboard/pesanan");
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-2 rounded-lg">
      <table className="w-full border-collapse border">
        <tbody>
          {transaction &&
            Object.entries({
              "ID Pesanan": transaction.transaction_id,
              Nama: transaction.first_name,
              Alamat: (
                <>
                  {transaction.alamat?.nama_jalan} <br />
                  {transaction.alamat?.kecamatan}
                </>
              ),
              "Tanggal Pemesanan": transaction.createdAt,
              Produk: transaction.item_details?.map(item => item.name).join(", "),            
              Jumlah: transaction.item_details?.reduce((total, item) => total + item.quantity, 0),
              "Ongkos Kirim": `Rp3.000`,
              "Total Harga": `Rp${transaction.gross_amount.toLocaleString('id-ID')}`,
            }).map(([label, value], index) => (
              <tr key={index} className="border">
                <td className="p-2 font-medium border-r">{label}</td>
                <td className="p-2">{value}</td>
              </tr>
            ))}
          <tr className="border">
            <td className="p-2 font-medium border-r">Status Pesanan</td>
            <td className="p-2">
              <select
                className="border rounded px-2 py-1 bg-yellow-200"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="diproses">diproses</option>
                <option value="dikirim">dikirim</option>
                <option value="selesai">selesai</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleStatusChange}
          className="px-4 py-2 bg-red-800 text-white rounded shadow hover:bg-red-700"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
