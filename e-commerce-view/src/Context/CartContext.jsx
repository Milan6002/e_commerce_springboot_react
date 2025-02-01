
import { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = async (userId, productId, quantity) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/auth/cart/add`, null, {
                params: { userId, productId, quantity }
            });
            setCart(response.data.cartItems);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    
    return (
        <CartContext.Provider value={{ cart, addToCart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
