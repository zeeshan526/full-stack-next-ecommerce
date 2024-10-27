"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import shirt from "./../../public/shirt.jpg";
import axios from "axios";
import { CartContext } from "@/app/components/CartContext";

const ProductDetailPage = ({ params }) => {
  const { addProductToCart } = useContext(CartContext);
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/products/${id}`)
        .then((response) => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setError(error.response?.data?.message || "Error fetching product");
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-96">
          <Image
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : "/images/placeholder.png"
            }
            alt={product.title}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-3xl font-bold text-gray-900">${product.price}</p>

          <button
            onClick={() => addProductToCart(product)}
            className="w-full inline-block px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
