import { useState, useContext, useEffect, createContext } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) {
      try {
        const parsedCart = JSON.parse(existingCartItem);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          console.warn(
            "Cart in localStorage is not an array. Resetting to empty array."
          );
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
