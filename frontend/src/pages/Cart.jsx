import { FaMinus, FaPlus, FaTimesCircle, FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL_PROFILE, URL_USER, URL_CART } from "../utils/Endpoint";
import { jwtDecode } from "jwt-decode";
import { icons } from "antd/es/image/PreviewGroup";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

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
                type === "increase"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex bg-[#F2E8C6] mb-3 p-3 py-5">
        <button
          onClick={handleBack}
          className="text-4xl text-red-800 me-4 ms-3"
        >
          <IoArrowBackCircleOutline />
        </button>
        <div className="text-center w-full">
          <h1 className="text-2xl font-semibold">Keranjang Saya</h1>
          <h4>Lihat dan kelola produk yang sudah dipilih sebelum checkout</h4>
        </div>
      </div>

      <div className="mx-auto p-6 bg-white grid grid-cols-6 gap-5">
        <div className="col-span-4">
          {cartItems.length === 0 ? (
            <div className="border min-h-full rounded-md border-gray-300 flex items-center justify-center">
              <p className="text-center text-gray-500">Keranjang kosong</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-4 font-semibold border-b p-4 border-gray-300 text-base">
              <div className="col-span-2">Produk</div>
              <div>Harga</div>
              <div>Jumlah</div>
              <div>Total</div>
              <div className="text-center">Aksi</div>
            </div>
          )}

          <div className="mt-4 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="grid grid-cols-6 items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-sm"
              >
                {/* Produk */}
                <div className="col-span-2 flex items-center gap-4">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <span className="text-gray-700 text-sm">{item.name}</span>
                </div>

                {/* Harga */}
                <div className="text-gray-700 text-base font-normal">
                  Rp {item.price.toLocaleString("id-ID")}
                </div>

                {/* Jumlah */}
                <div className="flex items-center bg-[#F2E8C6] gap-0 rounded-3xl w-max">
                  <button
                    className=" p-2 rounded-full hover:bg-[#F5E6B4]"
                    onClick={() => updateQuantity(item.productId, "decrease")}
                  >
                    <FaMinus />
                  </button>
                  <span className="px-3 font-semibold">{item.quantity}</span>
                  <button
                    className=" p-2 rounded-full hover:bg-[#F5E6B4]"
                    onClick={() => updateQuantity(item.productId, "increase")}
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Total */}
                <div className="text-gray-700 text-base font-semibold">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
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
                        selectedItems.includes(item.productId)
                          ? "text-white"
                          : "text-red-800"
                      }`}
                    />
                  </button>
                  <button
                    className="text-red-800 text-xl hover:text-red-700"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <FaTimesCircle style={{ fontSize: "25px" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="col-span-2">
          <div className="border border-stone-300 rounded-md mb-3">
            <div className="p-1 px-4">
              <div className="text-center py-2">
                <h1 className="font-bold text-lg text-red-800">
                  Ringkasan Pesanan
                </h1>
              </div>
              <hr className="border mb-2" />
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <p className="text-base font-normal">Subtotal</p>
                </div>
                <div className="">
                  <p className="text-base font-normal">
                    Rp{" "}
                    {cartItems
                      .filter((item) => selectedItems.includes(item.productId))
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <p className="text-base font-normal">Subtotal Pengiriman</p>
                </div>
                <div className="">
                  <p className="text-base font-normal">Rp 0</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F2E8C6] mt-6 p-3">
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <p className="text-base font-semibold">Total</p>
                </div>
                <div className="">
                  <p className="text-base font-semibold">
                    Rp{" "}
                    {cartItems
                      .filter((item) => selectedItems.includes(item.productId))
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-red-800 text-white rounded-full font-semibold hover:bg-red-700">
            CHECKOUT
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default CartPage;
