"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CartContext } from "@/app/components/CartContext";

const ProductDetailPage = ({ params }) => {
  const { addProductToCart } = useContext(CartContext);
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/products/${id}`)
        .then((response) => {
          setProduct(response.data);
          setSelectedImage(response.data.images[0]); 
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
      <div className="flex flex-col lg:flex-row lg:gap-8 gap-6">
        {/* Thumbnail Images for Desktop and Slider for Mobile */}
        <div className="lg:w-24 w-full lg:h-96 overflow-y-auto hidden lg:block thumbnail-container scrollbar-thin">
          <div className="space-y-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer border rounded-lg overflow-hidden w-16 h-16 ${
                  selectedImage === image
                    ? "border-orange-400"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Image */}
        <div className="relative w-full lg:w-1/2 h-96 flex items-center justify-center shadow-lg rounded-lg">
          <Image
            src={selectedImage || "/images/placeholder.png"}
            alt={product.title}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>

        {/* Mobile Slider for Thumbnails */}
        <div className="lg:hidden w-full mt-4 flex overflow-x-auto space-x-2 scrollbar-thin scrollbar-thumb-gray-300">
          {product.images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer border rounded-lg overflow-hidden w-16 h-16 flex-shrink-0 ${
                selectedImage === image
                  ? "border-orange-400"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${product.title} thumbnail ${index + 1}`}
                width={64}
                height={64}
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="w-full lg:w-1/2 space-y-6 lg:ml-8">
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
