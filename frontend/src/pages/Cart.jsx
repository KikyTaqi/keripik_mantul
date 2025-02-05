import { useState, useEffect } from "react";
import axios from "axios";
import { URL_PROFILE, URL_USER, URL_CART } from "../utils/Endpoint";
import { jwtDecode } from "jwt-decode";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);
     
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("userToken");
            const decoded = jwtDecode(token); // Decode token untuk mendapatkan email
            const response = await axios.post(`${URL_USER}/profile`, { email: decoded.email });
            setUserId(response.data[0]._id);

            axios.get(`${URL_CART}/${response.data[0]._id}`)
            .then(response => setCartItems(response.data.items || []))
            .catch(error => console.error("Error fetching cart:", error)); 
        } catch (error) {
            console.error("Error fetching profile:", error); 
        }
    };

    const removeFromCart = async (productId) => {
      try {
        const response = await axios.post(`${URL_CART}/remove`, {
          userId,
          productId,
        });
        setCartItems(response.data.items); // Update state setelah dihapus
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    };

    return (
      <div>
        <h2>Keranjang Belanja</h2>
        {cartItems.length === 0 ? (
          <p>Keranjang kosong</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.productId}>
              <img src={item.thumbnail} alt={item.name} width="50" />
              <p>{item.name}</p>
              <p>Rp {item.price.toLocaleString("id-ID")}</p>
              <p>Jumlah: {item.quantity}</p>
              <button onClick={() => removeFromCart(item.productId)}>Hapus</button>
            </div>
          ))
        )}
      </div>
    );
  };

export default CartPage;
