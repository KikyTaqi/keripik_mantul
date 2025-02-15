import React, { useState, useEffect } from "react";
import { Button, Tabs, ConfigProvider, Pagination, Rate, Input, message } from "antd";
import { LuMapPin } from "react-icons/lu";
import axios from "axios";
import { URL_ULASAN, URL_USER } from "../../utils/Endpoint";
import { useNavigate, useParams } from "react-router-dom";
import "../../style.css";
import { jwtDecode } from "jwt-decode";

const Review = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const params = useParams();
  const id = params.id;

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

  const handleSubmitReview = async () => {
        if (!rating || !comment) {
            message.error("Harap isi rating dan komentar!");
            return;
        }
    
        try {
            const token = localStorage.getItem("userToken");
            const decoded = jwtDecode(token);
    
            console.log("Mengirim ulasan untuk produk:", id);
    
            const response = await axios.post(`${URL_ULASAN}/${id}/ulasan`, {
                userId: decoded._id,
                username: decoded.name,
                rating,
                comment,
            });
            
            console.log("bakankdnajkak: " + decoded.name);
            
            console.log("Response dari server:", response.data);
    
            message.success("Ulasan berhasil ditambahkan!");

            setRating(0);
            setComment("");
            navigate(`/products/${id}`);
        } catch (error) {
            console.error("Gagal menambahkan ulasan:", error.response?.data || error.message);
            message.error("Terjadi kesalahan saat menambahkan ulasan.");
        }
    };

  const HandleBack = () => {
    navigate(-1);
  };

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
      <div className="border p-2 border-[#F2E8C6] rounded-md min-h-screen">
        <div className="bg-[#F2E8C6] text-center p-2 text-black font-bold text-lg rounded-lg">
          Beri Ulasan
        </div>
        <div className="p-4">

            <h1 className="text-lg font-bold mb-6">Tulis Ulasan</h1>
            <div className="mb-3">
            <h4 className="font-medium text-base mb-2">Skor:</h4>
            <Rate allowHalf value={rating} onChange={setRating} />
            </div>
            <div className="mb-3 min-h-[25rem]">
            <h4 className="font-medium text-base mb-2">Ulasan:</h4>
            <Input.TextArea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis ulasan Anda di sini..."
                className="!min-h-[20rem]"
                style={{ resize: 'none' }}
            />
            </div>
            <div className="flex justify-end">
            <Button
                type="secondary"
                className="px-10 py-4 border-red-800 hover:border-red-700 text-base me-4"
                onClick={HandleBack}
            >
                Batal
            </Button>
            <Button type="primary" className="px-10 py-4 text-base" onClick={handleSubmitReview}>
                Beri Ulasan
            </Button>
            </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Review;
