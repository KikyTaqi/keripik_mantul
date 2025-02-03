import { useCart } from "../context/CartContext";
import { Button } from "antd";

const Cart = () => {
    const { cartItems, removeFromCart } = useCart();

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold">Keranjang Belanja</h2>
            {cartItems.length === 0 ? (
                <p>Keranjang masih kosong.</p>
            ) : (
                cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b p-3">
                        <img src={item.thumbnail} alt={item.name} width="50" />
                        <p>{item.name}</p>
                        <p>Rp {item.price.toLocaleString("id-ID")}</p>
                        <Button danger onClick={() => removeFromCart(item.id)}>Hapus</Button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Cart;
