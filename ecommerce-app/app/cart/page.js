"use client";

import { useContext } from "react";
import { CartContext } from "../components/CartContext";
import Link from "next/link";
import cart from "./../public/emptycart.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Cart() {
  const router = useRouter();
  const {
    cartProducts,
    addProductToCart,
    decrementProductFromCart,
    deleteProduct,
    clearCart,
  } = useContext(CartContext);

  const totalQuantity = cartProducts.reduce(
    (acc, product) => acc + (product.quantity || 1),
    0
  );

  const totalPrice = cartProducts.reduce(
    (acc, product) =>
      acc + Number(product.price || 0) * (product.quantity || 1),
    0
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          {cartProducts.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="p-4">{product.title}</td>
                    <td className="p-4">${Number(product.price).toFixed(2)}</td>
                    <td className="p-4">{product.quantity || 1}</td>
                    <td className="p-4 flex space-x-2">
                      <button
                        onClick={() => addProductToCart(product)}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => decrementProductFromCart(product)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => deleteProduct(product)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
              <Image
                src={cart}
                alt="Premium Polo Shirts"
                width={500}
                height={500}
              />
              <button
                onClick={() => router.push("/")}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Go to Shop
              </button>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="w-full lg:w-1/3 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Summary</h2>
          <div className="mb-4">
            <p className="text-gray-600">Total Quantity: {totalQuantity}</p>
            <p className="text-gray-600">
              Total Price: ${Number(totalPrice).toFixed(2)}
            </p>
          </div>
          <button
            onClick={clearCart}
            className={`w-full px-4 py-2 text-white rounded-lg hover:bg-blue-700 ${
              cartProducts.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600"
            }`}
            disabled={cartProducts?.length === 0}
          >
            Clear Cart
          </button>
          <Link href={"/checkoutDetails"}>
            <button
              className={`w-full px-4 py-2 text-white rounded-lg hover:bg-red-700 mt-4 ${
                cartProducts.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600"
              }`}
              disabled={cartProducts?.length === 0}
            >
              Procceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
