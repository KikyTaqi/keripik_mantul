import React, { useState } from "react";
import { Rate, Button, Input, message } from "antd";
import axios from "axios";
import { URL_PRODUCT } from "../utils/Endpoint";
import { jwtDecode } from "jwt-decode";

const { TextArea } = Input;

const AddReview = ({ productId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!rating || !comment) {
            message.error("Silakan isi rating dan komentar!");
            return;
        }

        const token = localStorage.getItem("userToken");
        if (!token) {
            message.error("Anda harus login untuk memberikan ulasan!");
            return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded._id; // Pastikan JWT memiliki ID pengguna

        try {
            setLoading(true);
            await axios.post(`${URL_PRODUCT}/${productId}/reviews`, {
                userId,
                rating,
                comment,
            });

            message.success("Ulasan berhasil ditambahkan!");
            setRating(0);
            setComment("");
            onReviewAdded(); // Refresh daftar ulasan setelah menambahkan ulasan
        } catch (error) {
            console.error("Error adding review:", error);
            message.error("Gagal menambahkan ulasan. Coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#F2E8C6] rounded-md p-4 mb-5">
            <h2 className="text-lg font-medium mb-2">Tambah Ulasan</h2>
            <Rate
                allowHalf
                value={rating}
                onChange={setRating}
                className="text-yellow-500 mb-3"
            />
            <TextArea
                rows={4}
                placeholder="Tulis ulasan kamu di sini..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={300}
            />
            <Button
                onClick={handleSubmit}
                loading={loading}
                type="primary"
                className="mt-3 bg-red-800 hover:bg-red-700 text-white rounded-lg px-6 py-2"
            >
                Kirim Ulasan
            </Button>
        </div>
    );
};

export default AddReview;
