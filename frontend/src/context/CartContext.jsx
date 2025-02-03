import { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Buat Context
const CartContext = createContext();

// 2️⃣ Provider untuk membungkus aplikasi
export const CartProvider = ({ children }) => {
    // Cek Local Storage saat aplikasi pertama kali dibuka
    const initialCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const [cartItems, setCartItems] = useState(initialCart);

    // Simpan ke Local Storage setiap kali cartItems berubah
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Fungsi untuk menambah item ke keranjang
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const isItemInCart = prevItems.some((item) => item.id === product.id);
            if (isItemInCart) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    // Fungsi untuk menghapus item dari keranjang
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

// 3️⃣ Custom Hook untuk menggunakan Context
export const useCart = () => {
    return useContext(CartContext);
};
