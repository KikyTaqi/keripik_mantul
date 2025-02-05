import { FaMinus, FaPlus, FaTimesCircle, FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL_PROFILE, URL_USER, URL_CART } from "../utils/Endpoint";
import { jwtDecode } from "jwt-decode";
import { icons } from "antd/es/image/PreviewGroup";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const decoded = jwtDecode(token);
      const response = await axios.post(`${URL_USER}/profile`, {
        email: decoded.email,
      });
      setUserId(response.data[0]._id);

      axios
        .get(`${URL_CART}/${response.data[0]._id}`)
        .then((response) => setCartItems(response.data.items || []))
        .catch((error) => console.error("Error fetching cart:", error));
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const toggleSelect = (productId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post(`${URL_CART}/remove`, {
        userId,
        productId,
      });
      setCartItems(response.data.items);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = (productId, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity:
                type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  return (
    <div>
    <h2 className="text-2xl font-semibold mb-6 text-center">Keranjang Saya</h2>
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg flex gap-5">
      <div>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Keranjang kosong</p>
      ) : (
        <div className="grid grid-cols-5 gap-4 text-center font-semibold border-b p-4 border-gray-300">
          <div className="col-span-2">Produk</div>
          <div>Harga</div>
          <div>Jumlah</div>
          <div>Aksi</div>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="grid grid-cols-5 items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-sm"
          >
            {/* Produk */}
            <div className="col-span-2 flex items-center gap-4">
              <img src={item.thumbnail} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <span className="text-gray-700">{item.name}</span>
            </div>

            {/* Harga */}
            <div className="text-gray-700">Rp {item.price.toLocaleString("id-ID")}</div>

            {/* Jumlah */}
            <div className="flex items-center justify-center gap-2">
              <button
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                onClick={() => updateQuantity(item.productId, "decrease")}
              >
                <FaMinus />
              </button>
              <span className="px-3">{item.quantity}</span>
              <button
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                onClick={() => updateQuantity(item.productId, "increase")}
              >
                <FaPlus />
              </button>
            </div>

            {/* Hapus */}
            <div className="flex items-center justify-center gap-2">
            <button
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  selectedItems.includes(item.productId)
                    ? "bg-red-800 border-red-700 text-white"
                    : "border-red-800 text-gray-400"
                }`}
                onClick={() => toggleSelect(item.productId)}
              >
                <FaCheck
                style={{ fontSize: "15px" }}
                className={`transition-all duration-200 ${
                selectedItems.includes(item.productId) ? "text-white" : "text-red-800"
                }`}
                />
              </button>
              <button
                className="text-red-800 text-xl hover:text-red-700"
                onClick={() => removeFromCart(item.productId)}
              >
                <FaTimesCircle style={{fontSize:"25px"}}/>
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Ringkasan Pesanan */}
      <div>
      <div className="mt-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold border-b border-gray-300 px-2">Ringkasan Pesanan</h3>
        <div className="flex justify-between mt-2 text-gray-700 px-2">
          <span>Subtotal</span>
          <span>
            Rp{" "}
            {cartItems
              .filter((item) => selectedItems.includes(item.productId))
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between mt-2 text-gray-700 px-2">
          <span>Subtotal Pengiriman</span>
          <span>Rp 0</span>
        </div>
        <div className="flex justify-between text-xl font-semibold bg-yellow-300 mt-2">
          <span>Total</span>
          <span>Rp {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString("id-ID")}</span>
        </div>
        </div >
        <button className="w-full mt-4 py-2 bg-red-800 text-white rounded-full font-semibold hover:bg-red-700">
          CHECKOUT
        </button>
        </div>
    </div>
    </div>
  );
};

export default CartPage;
