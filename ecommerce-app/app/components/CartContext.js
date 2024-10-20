"use client";

import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export default function CartContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);

  const addProductToCart = (product) => {
    setCartProducts((prev) => {
      const productExists = prev.find((p) => p._id === product._id);
      if (productExists) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const decrementProductFromCart = (product) => {
    setCartProducts((prev) => {
      const productExists = prev.find((p) => p._id === product._id);
      if (productExists) {
        return prev.map((p) =>
          p._id === product._id && p.quantity > 1
            ? { ...p, quantity: p.quantity - 1 }
            : p
        );
      } else {
        return prev;
      }
    });
  };

  const clearCart = () => {
    setCartProducts([]);
  };

  const deleteProduct = (product) => {
    setCartProducts((prev) => prev.filter((p) => p._id !== product._id));
  };

  const calculateTotalPrice = () => {
    return cartProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    ).toFixed(2);
  };


  // Use useEffect to access localStorage on the client side
  useEffect(() => {
    // Check if 'window' exists to ensure it's running on the client side
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartProducts(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cartProducts.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartProducts));
    }
  }, [cartProducts]);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProductToCart,
        decrementProductFromCart,
        clearCart,
        deleteProduct,
        calculateTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
