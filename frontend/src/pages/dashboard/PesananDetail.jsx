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
        setStatus(response.data.status); // Set status dari database
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <table className="w-full border-collapse border border-gray-300">
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
              <tr key={index} className="border-b border-gray-300">
                <td className="p-2 font-medium bg-gray-100">{label}</td>
                <td className="p-2">{value}</td>
              </tr>
            ))}
          <tr className="border-b border-gray-300">
            <td className="p-2 font-medium bg-gray-100">Status Pesanan</td>
            <td className="p-2">
              <select
                className="border rounded px-2 py-1 bg-yellow-200"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Diproses">Diproses</option>
                <option value="Dikirim">Dikirim</option>
                <option value="Selesai">Selesai</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={handleStatusChange}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
      >
        Simpan Perubahan
      </button>
    </div>
  );
};

export default OrderDetails;
